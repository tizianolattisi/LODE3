package it.unitn.azorzi.annotations;

import com.google.gson.GsonBuilder;
import com.google.gson.internal.LinkedTreeMap;
import com.itextpdf.kernel.color.Color;
import com.itextpdf.kernel.color.DeviceRgb;
import com.itextpdf.kernel.geom.Rectangle;
import com.itextpdf.kernel.pdf.*;
import com.itextpdf.kernel.pdf.annot.*;

import java.io.ByteArrayOutputStream;
import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.util.Calendar;
import java.util.Date;
import java.util.List;

/**
 * Class containing static method for write annotations on pdf documents.
 */
public class PdfAnnotationsWriter {

    /**
     * Add to give pdf annotations
     *
     * @param pdfPath         Pdf document path
     * @param annotationsJson Json String representing the annotations to write
     * @return Pdf document with annotations
     * @throws IOException IO Exception.
     */
    public static byte[] generatePdfWithAnnotations(String pdfPath, String annotationsJson) throws IOException {

        File pdfFile = new File(pdfPath);

        FileInputStream is = new FileInputStream(pdfFile);
        ByteArrayOutputStream os = new ByteArrayOutputStream();

        Annotation[] annotations = new GsonBuilder()
                .setDateFormat("yyyy-MM-dd HH:mm:ss").create().fromJson(annotationsJson, Annotation[].class);

        PdfDocument pdfDoc = new PdfDocument(new PdfReader(is), new PdfWriter(os));

        for (Annotation a : annotations) {
            String annType = a.getType();

            if (annType.equals(Annotation.AnnotationType.RECT)) {
                writeRect(pdfDoc, a);
            } else if (annType.equals(Annotation.AnnotationType.CIRCLE)) {
                writeCircle(pdfDoc, a);
            } else if (annType.equals(Annotation.AnnotationType.NOTE)) {
                writeComment(pdfDoc, a);
            } else if (annType.equals(Annotation.AnnotationType.PENCIL)) {
                writeInk(pdfDoc, a);
            } else if (annType.equals(Annotation.AnnotationType.ARROW)) {
                writeArrow(pdfDoc, a);
            } else if (annType.equals(Annotation.AnnotationType.TEXT)) {
                writeText(pdfDoc, a);
            } else if (annType.equals(Annotation.AnnotationType.HIGHLIGHT)) {
                writeHighlight(pdfDoc, a);
            }
        }

        pdfDoc.close();
        return os.toByteArray();
    }


    private static void writeRect(PdfDocument pdfDoc, Annotation a) {

        PdfPage page = pdfDoc.getPage(a.getPageNumber());

        float x = getPointFromPixel(scale(a.getScales().getOrigLeft(), a.getScales().getOrigScaleX()).floatValue());
        float y = getYPointFromPixel(scale(a.getScales().getOrigTop(), a.getScales().getOrigScaleY()).floatValue(), page.getPageSize().getHeight());
        float w = getPointFromPixel(scale(((Double) a.getData().get("w")), a.getScales().getOrigScaleX()).floatValue());
        float h = getPointFromPixel(scale(((Double) a.getData().get("h")), a.getScales().getOrigScaleY()).floatValue());
        float strokeWidth = getPointFromPixel(scale((Double) a.getData().get("strokeWidth"), a.getScales().getOrigScaleY()).floatValue());

        PdfAnnotation square = new PdfSquareAnnotation(new Rectangle(x, y - h, w, h))
                .setColor(getColor((String) a.getData().get("stroke")))
                .setBorder(new PdfArray(new float[]{0.0f, 0.0f, strokeWidth}));
        page.addAnnotation(square);
    }

    private static void writeCircle(PdfDocument pdfDoc, Annotation a) {

        PdfPage page = pdfDoc.getPage(a.getPageNumber());

        float r = getPointFromPixel(scale((Double) a.getData().get("r"), a.getScales().getOrigScaleX()).floatValue());
        float cx = getPointFromPixel(scale(a.getScales().getOrigLeft(), a.getScales().getOrigScaleX()).floatValue());
        float cy = getYPointFromPixel(scale(a.getScales().getOrigTop(), a.getScales().getOrigScaleY()).floatValue(), page.getPageSize().getHeight());
        float strokeWidth = getPointFromPixel(scale((Double) a.getData().get("strokeWidth"), a.getScales().getOrigScaleY()).floatValue());


      PdfAnnotation circle = new PdfCircleAnnotation(new Rectangle(cx - r, cy - r, r * 2, r * 2))
                .setColor(getColor((String) a.getData().get("stroke")))
                .setBorder(new PdfArray(new float[]{0.0f, 0.0f, strokeWidth}));
        page.addAnnotation(circle);
    }

    private static void writeText(PdfDocument pdfDoc, Annotation a) {

        PdfPage page = pdfDoc.getPage(a.getPageNumber());

        float x = getPointFromPixel(scale(a.getScales().getOrigLeft(), a.getScales().getOrigScaleX()).floatValue());
        float y = getYPointFromPixel(scale(a.getScales().getOrigTop(), a.getScales().getOrigScaleY()).floatValue(), page.getPageSize().getHeight());
        float size = ((Double) a.getData().get("size")).floatValue() * (1 / a.getScales().getOrigScaleX().floatValue());

        PdfFreeTextAnnotation freeText = new PdfFreeTextAnnotation(new Rectangle(x, y - size, (size * ((String) a.getData().get("text")).length()) / 2, size), "");
        freeText.setContents(new PdfString((String) a.getData().get("text")));
        freeText.setIntent(PdfName.FreeTextCallout);

        page.addAnnotation(freeText);
    }

    private static void writeArrow(PdfDocument pdfDoc, Annotation a) {

        PdfPage page = pdfDoc.getPage(a.getPageNumber());

        float left = scale(a.getScales().getOrigLeft(), a.getScales().getOrigScaleX()).floatValue();
        float top = scale(a.getScales().getOrigTop(), a.getScales().getOrigScaleY()).floatValue();

        float x1 = getPointFromPixel(scale((Double) a.getData().get("x1"), a.getScales().getOrigScaleX()).floatValue());
        float y1 = getYPointFromPixel(scale((Double) a.getData().get("y1"), a.getScales().getOrigScaleY()).floatValue(), page.getPageSize().getHeight());
        float x2 = getPointFromPixel(scale((Double) a.getData().get("x2"), a.getScales().getOrigScaleX()).floatValue());
        float y2 = getYPointFromPixel(scale((Double) a.getData().get("y2"), a.getScales().getOrigScaleY()).floatValue(), page.getPageSize().getHeight());

        x1 = x1 - (left - x1);
        y1 = y1 - (top - y1);
        x2 = x2 - (left - x2);
        y2 = y2 - (top - y2);

        float llx = (x1 < x2) ? (x1) : (x2);
        float lly = (y1 < y2) ? (y1) : (y2);
        float w = Math.abs(x2 - x1);
        float h = Math.abs(y2 - y1);

        float strokeWidth = getPointFromPixel(scale((Double) a.getData().get("strokeWidth"), a.getScales().getOrigScaleX()).floatValue());

      PdfLineAnnotation arrow = new PdfLineAnnotation(
                new Rectangle(llx, lly, w, h),
                new float[]{x1, y1, x2, y2}
        );
        arrow.setColor(getColor((String) a.getData().get("stroke")));
        arrow.setInteriorColor(getColorArray((String) a.getData().get("stroke")));
        arrow.setBorder(new PdfArray(new float[]{0.0f, 0.0f, strokeWidth}));

        PdfArray le = new PdfArray();
        le.add(PdfName.None);
        le.add(PdfName.ClosedArrow);
        arrow.setLineEndingStyles(le);

        page.addAnnotation(arrow);
    }

    private static void writeComment(PdfDocument pdfDoc, Annotation a) {

        PdfPage page = pdfDoc.getPage(a.getPageNumber());

        float x = getPointFromPixel(scale(a.getScales().getOrigLeft(), a.getScales().getOrigScaleX()).floatValue());
        float y = getYPointFromPixel(scale(a.getScales().getOrigTop(), a.getScales().getOrigScaleY()).floatValue(), page.getPageSize().getHeight());

        PdfTextAnnotation comment = new PdfTextAnnotation(new Rectangle(x, y, 0, 0));

        if (a.getData().get("title") != null) {
            comment.setTitle(new PdfString((String) a.getData().get("title")));
        }
        if (a.getData().get("text") != null) {
            comment.setContents(getCommentText((LinkedTreeMap) a.getData().get("text")));
        }
        comment.setOpen(true);
        comment.setColor(new DeviceRgb(255, 208, 24));
        comment.setInteriorColor(new float[]{255.0f, 208.0f, 24.0f});

        if (a.getData().get("timestamp") != null) {
            Calendar cal = Calendar.getInstance();
            cal.setTime((Date) a.getData().get("timestamp"));
            comment.setDate(new PdfDate(cal).getPdfObject());
        }

        page.addAnnotation(comment);
    }

    private static void writeInk(PdfDocument pdfDoc, Annotation a) {

        PdfPage page = pdfDoc.getPage(a.getPageNumber());

        PathData pd = getPathData((List<LinkedTreeMap>) a.getData().get("paths"), page.getPageSize().getHeight(), a);
        float strokeWidth = getPointFromPixel(scale((Double) a.getData().get("strokeWidth"), a.getScales().getOrigScaleX()).floatValue());

      PdfInkAnnotation ink = new PdfInkAnnotation(new Rectangle(pd.getLlx(), pd.getLly(), pd.getUrx() - pd.getLlx(), pd.getUry() - pd.getLly()), pd.getList());
        ink.setColor(getColor((String) a.getData().get("stroke")));
        ink.setBorder(new PdfArray(new float[]{0.0f, 0.0f, strokeWidth}));

        page.addAnnotation(ink);
    }

    private static void writeHighlight(PdfDocument pdfDoc, Annotation a) {
        PdfPage page = pdfDoc.getPage(a.getPageNumber());

        List<LinkedTreeMap<String, Double>> rects = (List<LinkedTreeMap<String, Double>>) a.getData().get("rects");
        float[] pdfRects = new float[8];

        for (LinkedTreeMap<String, Double> r : rects) {
            Float x = getPointFromPixel(scale(r.get("x"), a.getScales().getOrigScaleX()).floatValue());
            Float y = getYPointFromPixel(scale(r.get("y"), a.getScales().getOrigScaleY()).floatValue(), page.getPageSize().getHeight());
            Float w = getPointFromPixel(scale(r.get("w"), a.getScales().getOrigScaleX()).floatValue());
            Float h = getPointFromPixel(scale(r.get("h"), a.getScales().getOrigScaleY()).floatValue());

            // Add lr, ll, ur, ul corners
            pdfRects[0] = (x + w);
            pdfRects[1] = (y - h);
            pdfRects[2] = (x);
            pdfRects[3] = (y - h);
            pdfRects[4] = (x + w);
            pdfRects[5] = (y);
            pdfRects[6] = (x);
            pdfRects[7] = (y);

            PdfAnnotation hl = PdfTextMarkupAnnotation.createHighLight(new Rectangle(x, y - h, w, h), pdfRects)
                    .setColor(getColor((String) a.getData().get("fill")));
            page.addAnnotation(hl);
        }

    }


    private static PathData getPathData(List<LinkedTreeMap> paths, float pageHeight, Annotation a) {

        Double origScaleX = a.getScales().getOrigScaleX();
        Double origScaleY = a.getScales().getOrigScaleY();

        float llx = Float.MAX_VALUE;
        float lly = Float.MAX_VALUE;
        float urx = 0.0f;
        float ury = 0.0f;
        PdfArray inkList = new PdfArray();

        for (LinkedTreeMap path : paths) {
            PdfArray subList = new PdfArray();
            inkList.add(subList);

            for (List<Object> p : (List<List<Object>>) path.get("path")) {

                if (p.get(0).equals("M") || p.get(0).equals("L")) {
                    float p1 = getPointFromPixel(scale((Double) p.get(1), origScaleX).floatValue());
                    float p2 = getYPointFromPixel(scale((Double) p.get(2), origScaleX).floatValue(), pageHeight);
                    subList.add(new PdfNumber(p1));
                    subList.add(new PdfNumber(p2));

                    urx = Math.max(urx, p1);
                    llx = Math.min(llx, p1);
                    ury = Math.max(ury, p2);
                    lly = Math.min(lly, p2);

                } else if (p.get(0).equals("Q")) {
                    float p1 = getPointFromPixel(scale((Double) p.get(3), origScaleX).floatValue());
                    float p2 = getYPointFromPixel(scale((Double) p.get(4), origScaleX).floatValue(), pageHeight);
                    subList.add(new PdfNumber(p1));
                    subList.add(new PdfNumber(p2));

                    urx = Math.max(urx, p1);
                    llx = Math.min(llx, p1);
                    ury = Math.max(ury, p2);
                    lly = Math.min(lly, p2);
                }
            }
        }

        llx = scale(llx, origScaleX).floatValue();
        lly = scale(lly, origScaleY).floatValue();
        urx = scale(urx, origScaleX).floatValue();
        ury = scale(ury, origScaleY).floatValue();

        return new PathData(llx, lly, urx, ury, inkList);
    }

    private static String getCommentText(LinkedTreeMap delta) {
        String result = "";

        if (delta != null && delta.get("ops") != null) {
            for (LinkedTreeMap insertObj : (List<LinkedTreeMap>) delta.get("ops")) {
                if (insertObj != null && insertObj.get("insert") != null) {
                    result = result + insertObj.get("insert");
                }
            }
        }
        return result;
    }

    private static float getPointFromPixel(float pixel) {
        return pixel * 0.75f;
    }

    private static float getYPointFromPixel(float pixel, float pageHeight) {
        return pageHeight - getPointFromPixel(pixel);
    }

    private static Color getColor(String colorStr) {
        return new DeviceRgb(
                Integer.valueOf(colorStr.substring(1, 3), 16),
                Integer.valueOf(colorStr.substring(3, 5), 16),
                Integer.valueOf(colorStr.substring(5, 7), 16));
    }

    private static PdfArray getColorArray(String colorStr) {
        PdfArray a = new PdfArray();
        a.add(new PdfNumber(Integer.valueOf(colorStr.substring(1, 3), 16)));
        a.add(new PdfNumber(Integer.valueOf(colorStr.substring(3, 5), 16)));
        a.add(new PdfNumber(Integer.valueOf(colorStr.substring(5, 7), 16)));
        return a;
    }

    private static Double scale(Double value, Double pdfScale) {
      return pdfScale == null ? value : value * (1 / pdfScale);
    }

  private static Double scale(float value, Double pdfScale) {
    return pdfScale == null ? value : value * (1 / pdfScale);
  }

    private static class PathData {
        float llx;
        float lly;
        float urx;
        float ury;
        PdfArray list;

        public PathData(float llx, float lly, float urx, float ury, PdfArray list) {
            this.llx = llx;
            this.lly = lly;
            this.urx = urx;
            this.ury = ury;
            this.list = list;
        }

        public float getLlx() {
            return llx;
        }

        public float getLly() {
            return lly;
        }

        public float getUrx() {
            return urx;
        }

        public float getUry() {
            return ury;
        }

        public PdfArray getList() {
            return list;
        }
    }
}

package main.java.it.unitn.azorzi.annotations;

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
     * @throws IOException
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

        float x = getPointFromPixel(((Double) a.getData().get("x")).floatValue());
        float y = getYPointFromPixel(((Double) a.getData().get("y")).floatValue(), page.getPageSize().getHeight());
        float w = getPointFromPixel(((Double) a.getData().get("w")).floatValue());
        float h = getPointFromPixel(((Double) a.getData().get("h")).floatValue());

        PdfAnnotation square = new PdfSquareAnnotation(new Rectangle(x, y - h, w, h))
                .setColor(getColor((String) a.getData().get("stroke")))
                .setBorder(new PdfArray(new float[]{0.0f, 0.0f, getPointFromPixel(((Double) a.getData().get("strokeWidth")).floatValue())}));
        page.addAnnotation(square);
    }

    private static void writeCircle(PdfDocument pdfDoc, Annotation a) {

        PdfPage page = pdfDoc.getPage(a.getPageNumber());

        float cx = getPointFromPixel(((Double) a.getData().get("cx")).floatValue());
        float cy = getYPointFromPixel(((Double) a.getData().get("cy")).floatValue(), page.getPageSize().getHeight());
        float r = getPointFromPixel(((Double) a.getData().get("r")).floatValue());

        PdfAnnotation circle = new PdfCircleAnnotation(new Rectangle(cx - r, cy - r, r * 2, r * 2))
                .setColor(getColor((String) a.getData().get("stroke")))
                .setBorder(new PdfArray(new float[]{0.0f, 0.0f, getPointFromPixel(((Double) a.getData().get("strokeWidth")).floatValue())}));
        page.addAnnotation(circle);
    }

    private static void writeText(PdfDocument pdfDoc, Annotation a) {

        PdfPage page = pdfDoc.getPage(a.getPageNumber());

        float x = getPointFromPixel(((Double) a.getData().get("x")).floatValue());
        float y = getYPointFromPixel(((Double) a.getData().get("y")).floatValue(), page.getPageSize().getHeight());
        float size = ((Double) a.getData().get("size")).floatValue();

        PdfFreeTextAnnotation freeText = new PdfFreeTextAnnotation(new Rectangle(x, y - size, (size * ((String) a.getData().get("text")).length()) / 2, size), "");
        freeText.setContents(new PdfString((String) a.getData().get("text")));
        freeText.setIntent(PdfName.FreeTextCallout);

        page.addAnnotation(freeText);
    }

    private static void writeArrow(PdfDocument pdfDoc, Annotation a) {

        PdfPage page = pdfDoc.getPage(a.getPageNumber());

        float x1 = getPointFromPixel(((Double) a.getData().get("x1")).floatValue());
        float y1 = getYPointFromPixel(((Double) a.getData().get("y1")).floatValue(), page.getPageSize().getHeight());
        float x2 = getPointFromPixel(((Double) a.getData().get("x2")).floatValue());
        float y2 = getYPointFromPixel(((Double) a.getData().get("y2")).floatValue(), page.getPageSize().getHeight());

        float llx = (x1 < x2) ? (x1) : (x2);
        float lly = (y1 < y2) ? (y1) : (y2);
        float w = Math.abs(x2 - x1);
        float h = Math.abs(y2 - y1);

        PdfLineAnnotation arrow = new PdfLineAnnotation(
                new Rectangle(llx, lly, w, h),
                new float[]{x1, y1, x2, y2}
        );
        arrow.setColor(getColor((String) a.getData().get("stroke")));
        arrow.setInteriorColor(getColorArray((String) a.getData().get("stroke")));
        arrow.setBorder(new PdfArray(new float[]{0.0f, 0.0f, getPointFromPixel(((Double) a.getData().get("strokeWidth")).floatValue())}));

        PdfArray le = new PdfArray();
        le.add(PdfName.None);
        le.add(PdfName.ClosedArrow);
        arrow.setLineEndingStyles(le);

        page.addAnnotation(arrow);
    }

    private static void writeComment(PdfDocument pdfDoc, Annotation a) {

        PdfPage page = pdfDoc.getPage(a.getPageNumber());

        float x = getPointFromPixel(((Double) a.getData().get("x")).floatValue());
        float y = getYPointFromPixel(((Double) a.getData().get("y")).floatValue(), page.getPageSize().getHeight());

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

        PathData pd = getPathData((List<LinkedTreeMap>) a.getData().get("paths"), page.getPageSize().getHeight());

        PdfInkAnnotation ink = new PdfInkAnnotation(new Rectangle(pd.getLlx(), pd.getLly(), pd.getUrx() - pd.getLlx(), pd.getUry() - pd.getLly()), pd.getList());
        ink.setColor(getColor((String) a.getData().get("stroke")));
        ink.setBorder(new PdfArray(new float[]{0.0f, 0.0f, getPointFromPixel(((Double) a.getData().get("strokeWidth")).floatValue())}));

        page.addAnnotation(ink);
    }

    private static void writeHighlight(PdfDocument pdfDoc, Annotation a) {
        PdfPage page = pdfDoc.getPage(a.getPageNumber());

        List<LinkedTreeMap<String, Double>> rects = (List<LinkedTreeMap<String, Double>>) a.getData().get("rects");
        float[] pdfRects = new float[8];

        for (LinkedTreeMap<String, Double> r : rects) {

            Float x = getPointFromPixel(r.get("x").floatValue());
            Float y = getYPointFromPixel(r.get("y").floatValue(), page.getPageSize().getHeight());
            Float w = getPointFromPixel(r.get("w").floatValue());
            Float h = getPointFromPixel(r.get("h").floatValue());

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


    private static PathData getPathData(List<LinkedTreeMap> paths, float pageHeight) {

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
                    float p1 = getPointFromPixel(((Double) p.get(1)).floatValue());
                    float p2 = getYPointFromPixel(((Double) p.get(2)).floatValue(), pageHeight);
                    subList.add(new PdfNumber(p1));
                    subList.add(new PdfNumber(p2));

                    urx = Math.max(urx, p1);
                    llx = Math.min(llx, p1);
                    ury = Math.max(ury, p2);
                    lly = Math.min(lly, p2);

                } else if (p.get(0).equals("Q")) {
                    float p1 = getPointFromPixel(((Double) p.get(3)).floatValue());
                    float p2 = getYPointFromPixel(((Double) p.get(4)).floatValue(), pageHeight);
                    subList.add(new PdfNumber(p1));
                    subList.add(new PdfNumber(p2));

                    urx = Math.max(urx, p1);
                    llx = Math.min(llx, p1);
                    ury = Math.max(ury, p2);
                    lly = Math.min(lly, p2);
                }
            }
        }

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

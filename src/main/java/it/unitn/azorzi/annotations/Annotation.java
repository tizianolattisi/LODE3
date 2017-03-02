package main.java.it.unitn.azorzi.annotations;

import java.util.Date;
import java.util.LinkedHashMap;

/**
 * Representations of an annotation used by gson to parse Json String containing annotations
 */
public class Annotation {

    private String uuid;
    private String pdfId;
    private int pageNumber;
    private String type;
    private Double time;
    private Date timestamp;
    private String uid;
    private LinkedHashMap<String, Object> data;

    public Annotation() { // constructor for gson
    }

    public String getUuid() {
        return uuid;
    }

    public String getPdfId() {
        return pdfId;
    }

    public int getPageNumber() {
        return pageNumber;
    }

    public String getType() {
        return type;
    }

    public Double getTime() {
        return time;
    }

    public Date getTimestamp() {
        return timestamp;
    }

    public String getUid() {
        return uid;
    }

    public LinkedHashMap<String, Object> getData() {
        return data;
    }

    public static class AnnotationType {
        public static final String RECT = "rect";
        public static final String CIRCLE = "circle";
        public static final String NOTE = "note";
        public static final String PENCIL = "pencil";
        public static final String TEXT = "text";
        public static final String ARROW = "arrow";
        public static final String HIGHLIGHT = "highlight";
    }
}

package net.wlodi.experimental.lb.model;


public class Greeting {

    private final long id;
    private final String content;

    private final String nodeName;

    public Greeting( long id , String content , String nodeName ) {
        this.id = id;
        this.content = content;
        this.nodeName = nodeName;
    }

    public long getId( ) {
        return id;
    }

    public String getContent( ) {
        return content;
    }

    public String getNodeName( ) {
        return nodeName;
    }
}

package net.wlodi.experimental.lb;


import org.apache.catalina.connector.Connector;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.web.embedded.tomcat.TomcatServletWebServerFactory;
import org.springframework.boot.web.servlet.server.ServletWebServerFactory;
import org.springframework.context.annotation.Bean;
import org.springframework.web.filter.CommonsRequestLoggingFilter;


@SpringBootApplication
public class Application {

    private static final String NODE_INFORMATION_TEMPLATE = "Node information: ajp_port=%s | http_port=%s | jvmRoute=%s";

    @Value ( "${node.ajpPort}" )
    private int AJP_PORT;
    @Value ( "${node.httpPort}" )
    private int HTTP_PORT;
    @Value ( "${node.jvmRoute}" )
    private String JVM_ROUTE;

    private TomcatServletWebServerFactory tomcat;

    private Connector ajpConnector;

    public static void main( String[] args ) {
        SpringApplication.run( Application.class, args );
    }

    @Bean
    public ServletWebServerFactory servletContainer( ) {

        tomcat = new TomcatServletWebServerFactory( HTTP_PORT );

        ajpConnector = new Connector( "AJP/1.3" );
        ajpConnector.setPort( AJP_PORT );
        ajpConnector.setSecure( false );
        ajpConnector.setAllowTrace( false );
        ajpConnector.setScheme( "http" );

        tomcat.addAdditionalTomcatConnectors( ajpConnector );

        return tomcat;
    }

    @Bean
    public CommonsRequestLoggingFilter requestLoggingFilter( ) {
        CommonsRequestLoggingFilter loggingFilter = new CommonsRequestLoggingFilter();
        loggingFilter.setIncludeClientInfo( true );
        loggingFilter.setIncludeQueryString( true );
        loggingFilter.setIncludePayload( true );
        loggingFilter.setIncludeHeaders( true );
        return loggingFilter;
    }

    public String getNodeInformation( ) {
        return String.format( NODE_INFORMATION_TEMPLATE, AJP_PORT, HTTP_PORT, JVM_ROUTE );
    }

    public String getJVM_ROUTE( ) {
        return JVM_ROUTE;
    }

    public int getHTTP_PORT( ) {
        return HTTP_PORT;
    }

    public int getAJP_PORT( ) {
        return AJP_PORT;
    }

}

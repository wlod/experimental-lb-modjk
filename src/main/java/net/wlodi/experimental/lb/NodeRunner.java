package net.wlodi.experimental.lb;


import org.springframework.boot.SpringApplication;


public class NodeRunner {

    public static void main( String[] args ) {

        SpringApplication.run( Application.class, "--node.ajpPort=8009", "--node.httpPort=8080", "--node.jvmRoute=app-worker1" );
        SpringApplication.run( Application.class, "--node.ajpPort=8019", "--node.httpPort=8090", "--node.jvmRoute=app-worker2" );

    }
}

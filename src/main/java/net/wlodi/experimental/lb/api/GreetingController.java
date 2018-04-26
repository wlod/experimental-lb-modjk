package net.wlodi.experimental.lb.api;


import java.util.concurrent.atomic.AtomicInteger;
import java.util.concurrent.atomic.AtomicLong;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import net.wlodi.experimental.lb.Application;
import net.wlodi.experimental.lb.model.Greeting;


@RestController ( )
@RequestMapping ( "/api/app" )
public class GreetingController {

    private static final Logger LOGGER = LoggerFactory.getLogger( GreetingController.class );

    private static final String RESPONSE_TEMPLATE = "Hello, %s!";
    private static final String JSESSIONID_TEMPLATE = "JSESSIONID=AJP_PORT_%s.%s; Path=/;"; // for poc without HttpOnly;

    private final AtomicLong counter = new AtomicLong();
    private final AtomicInteger disableApiTime = new AtomicInteger( 0 );

    private Application app;

    public GreetingController( Application app ) {
        this.app = app;
    }

    /**
     * 
     * @param name
     * @return
     * @throws InterruptedException
     */
    @RequestMapping ( value = "/greeting" , method = RequestMethod.GET )
    public ResponseEntity< ? > greeting( @RequestParam ( value = "name" , defaultValue = "World" ) String name ) throws InterruptedException {

        // Only for POC - if you want do that strange thing please use a interceptor or something else.
        int disableApiTimeInSeconds = disableApiTime.get();
        if (disableApiTimeInSeconds > 0) {
            LOGGER.info( "API is disable for {}s, on jvmRoute {}.", disableApiTimeInSeconds, app.getJVM_ROUTE() );
            return new ResponseEntity<>( HttpStatus.SERVICE_UNAVAILABLE );
        }

        Greeting greeting = new Greeting( counter.incrementAndGet(), String.format( RESPONSE_TEMPLATE, name ), app.getNodeInformation() );

        return createSuccessResponseEntity( greeting );
    }

    /**
     * 
     * @param durationTimeSetting
     * @return status - status for operation: HttpStatus.OK after set value for delay HttpStatus.METHOD_NOT_ALLOWED when the value is already set
     */
    @RequestMapping ( value = "/disableGreetingApi" , method = RequestMethod.PUT )
    public ResponseEntity< ? > stop( @RequestParam ( value = "durationTimeSetting" , defaultValue = "60" ) int durationTimeSetting ) {

        if (disableApiTime.get() > 0) {
            return new ResponseEntity<>( HttpStatus.METHOD_NOT_ALLOWED );
        }

        LOGGER.info( "Disable API for: {}s - durationTimeSetting: {}s, on jvmRoute: {}.", durationTimeSetting, app.getJVM_ROUTE() );
        disableApiTime.set( durationTimeSetting );

        new Thread() {

            public void run( ) {
                try {
                    Thread.sleep( durationTimeSetting * 1000 );
                    disableApiTime.set( 0 );
                    LOGGER.info( "Enable API - back to normal, on jvmRoute: {}.", app.getJVM_ROUTE() );
                }
                catch ( InterruptedException e ) {
                    LOGGER.error( e.getMessage(), e );
                }
            }
        }.start();

        return createSuccessResponseEntity( "disableGreetingApi: on" );
    }

    private ResponseEntity< ? > createSuccessResponseEntity( Object object ) {

        HttpHeaders responseHeaders = new HttpHeaders();
        responseHeaders.set( "Set-Cookie", String.format( JSESSIONID_TEMPLATE, app.getAJP_PORT(), app.getJVM_ROUTE() ) );

        return new ResponseEntity<>( object, responseHeaders, HttpStatus.OK );
    }
}

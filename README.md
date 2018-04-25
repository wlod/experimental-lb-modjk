# Experiment: Apache httpd + mod_jk + two instances of a simple Spring Boot application 

# 1. Quick instruction to install Apache httpd with mod_jk

Below instruction based on Ubuntu or Windows 10 with Linux Bash Shell (Ubuntu) (https://docs.microsoft.com/en-us/windows/wsl/install-win10)

Open terminal and type following commands to install Apache http:
```sh
$ sudo apt-get update
$ sudo apt-get install apache2
```
Next, you have to install mod_jk, so back to terminal and type:
```sh
$ sudo apt-get install libapache2-mod-jk
```
And that's it!

You can check the instllation by type
```sh
$ sudo service apache2 status
```

You should see: `apache2 is running` or `apache2 is not running`.

Below table shows paths to files with important things to this PoC:
| File path | Description |
| --- | --- |
| /etc/apache2 | Directory with home path to Apache httpd  |
| /etc/apache2/apache2.conf | Main Apache httpd configuration |
| /etc/apache2/sites-available/000-default.conf | Virtualhost configuration |
| /etc/apache2/mods-enabled/jk.conf | Mod_jk configuration file |
| /var/logs/apache2/ | Directory with Apache httpd and mod_jk logs |
| Custom paths | - |
| /etc/apache2/conf/workers.properties | Mod_jk workers configuration  |
| /var/logs/apache2/local-apache.wlodi.net_error.log | Error logs only for our virtualhost |
| /var/logs/apache2/local-apache.wlodi.net_access.log | Access logs only for our virtualhost |
| /var/log/apache2/local-apache.wlodi.net_mod_jk.log | Mod_jk logs file only for our virtualhost |


Below table shows few simple commands to manage an Apache httpd server:
| Command | Description |
| --- | --- |
| sudo service apache2 status | Check status |
| sudo service apache2 restart | Restart Apache |
| sudo service apache2 start | Start Apache |
| sudo service apache2 stop | Stop Apache |
| sudo service apache2 graceful | Reload configuration |

If you working on Windows 10 with bash probably you will have **warning** with:
> TCP_DEFER_ACCEPT

To fix it, please add two lines to file `apache2.conf`:
```sh
AcceptFilter https none
AcceptFilter http none
```

# 2. Apache httpd configuration

Default Apache httpd configuration includes `000-default.conf` file.  So we append our new virtualhost to this file.

Firstly add new listener port, by add following line to top of the file:
```sh
Listen 1234
```
Next, add whole VirtualHost on port 1234:

```sh
<VirtualHost *:1234>

  DocumentRoot /var/www/html

  ErrorLog ${APACHE_LOG_DIR}/local-apache.wlodi.net_error.log
  CustomLog ${APACHE_LOG_DIR}/local-apache.wlodi.net_access.log combined

  Header edit Set-Cookie "^(.*)" $1
  
  RewriteEngine  on
  RewriteRule    "^/http-client/(.*)$"  "/http-client/$1" [L,PT]

  JkMount /jkmanager/* jkstatus
  <Location /jkmanager>
    Order deny,allow
    Deny from all
    Allow from all
  </Location>

  JkOptions +ForwardKeySize +ForwardURICompat -ForwardDirectories
  JkLogFile ${APACHE_LOG_DIR}/local-apache.wlodi.net_mod_jk.log
  JkLogLevel info
  JkLogStampFormat "[%a %b %d %H:%M:%S %Y]"

  JkMount  /api/* app-worker-balancer

</VirtualHost>
```

> TODO missing description

Final files
[000-default.conf](apache/000-default.conf)
[apache2.conf](apache/apache2.conf)

# 3. mod_jk configuration

Firstly change the path to workers in main configuration `jk.conf`, replace current value for JkWorkersFile to:

```sh
JkWorkersFile /etc/apache2/conf/workers.properties
```

Next, create new file:
```sh
$ sudo touch /etc/apache2/conf/workers.properties
```

And add workers configuration in `workers.properties`:
```sh
worker.list=app-worker-balancer,jkstatus

worker.jkstatus.type=status

worker.app-worker-balancer.type=lb
worker.app-worker-balancer.balance_workers=app-worker2,app-worker1
worker.app-worker-balancer.sticky_session=1

worker.ajptemplate.type=ajp13
worker.ajptemplate.lbfactor=1
worker.ajptemplate.retries=1
worker.ajptemplate.recover_time=1
worker.ajptemplate.fail_on_status=500,503
worker.ajptemplate.ping_mode=A
worker.ajptemplate.ping_timeout=2000

worker.app-worker1.reference=worker.ajptemplate
worker.app-worker1.host=localhost
worker.app-worker1.port=8009

worker.app-worker2.reference=worker.ajptemplate
worker.app-worker2.host=localhost
worker.app-worker2.port=8019
```

> TODO missing description

Final files
[jk.conf](apache/jk.conf)
[workers.properties](apache/workers.properties)

# 4. HTML/JS Client

To install client application you can:
- Copy http-client from this repository to /var/www/html/
- Create symbolic link ({path_to_project} is path to directory with this repository):
```
cd /var/www/html/
ln -s {path_to_project}/http-client http-client
```

After that you should have access to client by URL:
```
http://host:port/http-client/client.html
```
Host and port for our configuration:
```
host = 127.0.0.1
port: 1234
```

How the client works, you can check the [demo.gif](demo/lb-mod-jk-demo.gif).

# 5. Spring Boot Application

To run application, please clone or download this project, then type following commands:
```sh
mvn clean install
mvn exec:java
```

Above commands run NodeRunner - ports configuration are hardcoded inside this class:
```sh
SpringApplication.run( Application.class, "--node.ajpPort=8009", "--node.httpPort=8080", "--node.jvmRoute=app-worker1" );
SpringApplication.run( Application.class, "--node.ajpPort=8019", "--node.httpPort=8090", "--node.jvmRoute=app-worker2" );
```
If you would like to change it, please remember to update mod_jk workers configuration.

# 6. Tests and tests conclusion

> TODO

# 7. Compatibility

> TODO missing version of mod_jk, apache htppd, OS etc.

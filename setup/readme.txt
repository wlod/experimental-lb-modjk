Install Apache with modules - windows bash:

sudo apt-get update
sudo apt-get install apache2

sudo apt-get install libapache2-mod-jk

Configuration mod_jk
path to configuration file:
	/etc/apache2/mods-enabled/jk.conf





Install html client on Apache:

	copy http-client to /var/www/html/
	
	OR:
	
	Symbolic link to project
	
	cd /var/www/html/
	ln -s {path_to_project}/http-client http-client
	
Apache access:
	
	http://host:port/http-client/client.html
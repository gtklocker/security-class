<VirtualHost *:80>
    ServerName www.example.com
    ServerAlias www.example.com example.com
    DocumentRoot /var/www/example.com/html/
    ServerAdmin example@gmail.com
    CustomLog /var/log/apache2/example.log common
</VirtualHost>
<VirtualHost *:443>
    ServerName www.example.com
    ServerAlias www.example.com example.com
    DocumentRoot /var/www/example.com/html/
    ServerAdmin example@gmail.com
    CustomLog /var/log/apache2/example.log common

    SSLEngine on
    SSLOptions +StrictRequire

    <Directory />
        SSLRequireSSL
    </Directory>

    SSLProtocol -all +TLSv1 +SSLv3
    SSLCipherSuite HIGH:MEDIUM:!aNULL:+SHA1:+MD5:+HIGH:+MEDIUM

    SSLCertificateFile /etc/apache2/ssl/example.com.crt
    SSLCertificateChainFile /etc/apache2/ssl/sub.class1.server.ca.pem
    SSLCertificateKeyFile /etc/apache2/ssl/example.com.key
    SSLCACertificateFile /etc/apache2/ssl/ca.pem

    SSLVerifyClient none
    SSLProxyEngine off 

    <IfModule mime.c>
        AddType application/x-x509-ca-cert      .crt
        AddType application/x-pkcs7-crl         .crl
    </IfModule>

    SetEnvIf User-Agent ".*MSIE.*" nokeepalive ssl-unclean-shutdown
</VirtualHost>

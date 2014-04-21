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

    SSLProtocol -all +TLSv1 +SSLv3 +TLSv1.1 +TLSv1.2
    SSLCipherSuite ECDHE-RSA-AES256-GCM-SHA384:ECDHE-RSA-AES256-SHA384:ECDHE-RSA-AES128-GCM-SHA256:ECDHE-RSA-AES128-SHA256:ECDHE-RSA-AES256-SHA:!RC4:HIGH:!MD5:!aNULL:!EDH
    SSLHonorCipherOrder on
    SSLCompression off

    Header add Strict-Transport-Security "max-age=15768000"

    SSLCertificateFile /etc/apache2/ssl/example.com.crt
    SSLCertificateChainFile /etc/apache2/ssl/sub.class1.server.ca.pem
    SSLCertificateKeyFile /etc/apache2/ssl/example.com.key

    SSLVerifyClient none
    SSLProxyEngine off 

    <IfModule mime.c>
        AddType application/x-x509-ca-cert      .crt
        AddType application/x-pkcs7-crl         .crl
    </IfModule>

    SetEnvIf User-Agent ".*MSIE.*" nokeepalive ssl-unclean-shutdown
</VirtualHost>

# Symfony 3 Course

This course is based for PHP5 Objected Oriented developers.

### Drive PPT
The link to the drive is [https://drive.google.com/open?id=0B9HVbv29cDuvbXNwWXlEZzV5dE0](https://drive.google.com/open?id=0B9HVbv29cDuvbXNwWXlEZzV5dE0)

## Installation:

Start by installing git and set up your ssh connection. 

The official documentation is available on github: [https://help.github.com/articles/checking-for-existing-ssh-keys/#platform-linux](https://help.github.com/articles/checking-for-existing-ssh-keys/#platform-linux)

The steps to follow is available here: [https://drive.google.com/open?id=0B9HVbv29cDuvRXQ0M1dIckRpSXM](https://drive.google.com/open?id=0B9HVbv29cDuvRXQ0M1dIckRpSXM)


#### If your environment is not configured you can use the following bash file to install the required packages for this course:

```
git clone https://github.com/khalid-s/dev-environment-installation.git ~
```

Go to the installation folder
```
cd ~/dev-environment-installation
```

Then launch the install bash file 
```
./install.sh
```

during the installation process set a password equal to 'paris' for MySQL

##### This installation process is for first time installation on  fresh ubuntu.

For ease purpose set all passwords to paris. You will be able to change your password later for production.

If you choose another password for mysql then be careful not to take the default password paris when the app is being installed


## Once your dev environment is installed, proceed from here
Go to your web server root:
```
cd /var/www
```

Clone the repository in a folder called symfony
```
git clone https://github.com/iknsa-formation/symfony3.git symfony
```
Go into the newly cloned repository 

```
cd symfony
```

## Configure your hosts

While the installation is going on, you can configure your hosts to point on http://symfony.dev so as to keep the same configuration as our production server

You can find all the related details about configuring your apache on ubuntu server here: [https://help.ubuntu.com/lts/serverguide/httpd.html](https://help.ubuntu.com/lts/serverguide/httpd.html)

1. In your hosts file (/etc/hosts)
    With either vi, vim or your favourite editor add the following line:
    ```
    127.0.1.1   symfony.dev
    127.0.1.1   www.symfony.dev
    ```

2. Copy the apache vhost default config file to create a symfony.conf file:
    ```
    sudo cp /etc/apache2/sites-available/000-default.conf /etc/apache2/sites-available/symfony.conf
    ```

    Using a text editor (vi, vim, sublime text...) add the following content to the newly created file /etc/apache2/sites-available/symfony.conf (! You need to be a sudoer to save your modifications to this file):

    ```
    <VirtualHost *:80>
        ServerName symfony.dev
        ServerAlias www.symfony.dev

        DocumentRoot /var/www/symfony/web
        <Directory /var/www/symfony/web>
            AllowOverride None
            Order Allow,Deny
            Allow from All

            <IfModule mod_rewrite.c>
                Options -MultiViews
                RewriteEngine On
                RewriteCond %{REQUEST_FILENAME} !-f
                RewriteRule ^(.*)$ app_dev.php [QSA,L]
            </IfModule>
        </Directory>

        # uncomment the following lines if you install assets as symlinks
        # or run into problems when compiling LESS/Sass/CoffeScript assets
        # <Directory /var/www/project>
        #     Options FollowSymlinks
        # </Directory>

        # optionally disable the RewriteEngine for the asset directories
        # which will allow apache to simply reply with a 404 when files are
        # not found instead of passing the request into the full symfony stack
        <Directory /var/www/project/web/bundles>
            <IfModule mod_rewrite.c>
                RewriteEngine Off
            </IfModule>
        </Directory>
        ErrorLog /var/log/apache2/project_error.log
        CustomLog /var/log/apache2/project_access.log combined
    </VirtualHost>
    ```

3. Create a symlink to the enable sites with a2ensite:
    ```
    sudo a2ensite symfony
    ```

4. One of the ways to remove the app_dev.php in the url is to use the rewrite mod of your server. So let's enble it in apache :
    ```
    sudo a2enmod rewrite
    ```

5. Restart your server
    ```
    sudo service apache2 restart
    ```

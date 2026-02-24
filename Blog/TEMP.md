![Install MongoDB on Debian](//blog.mazey.net/mazey-cn/asset/how-to-install-mongodb-on-debian-10.webp)

MongoDB is a free and open-source document database. It belongs to a family of databases called NoSQL, which is different from the traditional table-based SQL databases like MySQL and PostgreSQL.

In MongoDB, data is stored in flexible, [JSON-like](https://www.json.org/json-en.html) documents where fields can vary from document to document. It does not require a predefined schema, and data structure can be changed over time.

In this tutorial, we will explain how to install and configure the latest version of MongoDB Community Edition on Debian 10 Buster.

## Installing MongoDB

MongoDB is not available in the standard Debian Buster repositories. We’ll enable the official MongoDB repository and install the packages.

At the time of writing this article, the latest version of MongoDB is version 4.2. Before starting with the installation, head over to the [Install on Debian](https://docs.mongodb.com/manual/tutorial/install-mongodb-on-debian/) page of MongoDB’s documentation and check if there is a new version available.

Perform the following steps as root or [user with sudo privileges](https://linuxize.com/post/how-to-create-a-sudo-user-on-debian/) to install MongoDB on a Debian system:

**1\. Install the packages required for adding a new repository:**

```
sudo apt install dirmngr gnupg apt-transport-https software-properties-common ca-certificates curl
```

**2\. Add the MongoDB GPG key to your system:**

```
curl -fsSL https://www.mongodb.org/static/pgp/server-4.2.asc | sudo apt-key add -
```

**3\. Enable the MongoDB repository:**

```
sudo add-apt-repository 'deb https://repo.mongodb.org/apt/debian buster/mongodb-org/4.2 main'
```

Packages with older versions of MongoDB are not available for Debian 10.

**4\. Update the packages list and install the `mongodb-org` meta-package:**

```
sudo apt update
sudo apt install mongodb-org
```

The following packages will be installed on the system as a part of the `mongodb-org` package:

* `mongodb-org-server` - The `mongod` daemon and corresponding init scripts and configurations.
* `mongodb-org-mongos` - The `mongos` daemon.
* `mongodb-org-shell` - The mongo shell is an interactive JavaScript interface to MongoDB. It is used to perform administrative tasks through the command line.
* `mongodb-org-tools` - Contains several MongoDB tools for importing and exporting data, statistics, as well as other utilities.

**5\. Start the MongoDB service and enable it to start on boot:**

```
sudo systemctl enable mongod --now
```

**6\. To verify whether the installation has completed successfully, connect to the MongoDB database server using the `mongo` tool and print the connection status:**

```
mongo --eval 'db.runCommand({ connectionStatus: 1 })'
```

The output will look like this:

```
MongoDB shell version v4.2.1
connecting to: mongodb://127.0.0.1:27017/?compressors=disabled&gssapiServiceName=mongodb
Implicit session: session { "id" : UUID("09f11c53-605f-44ad-abec-ec5801bb6b06") }
MongoDB server version: 4.2.1
{
	"authInfo" : {
		"authenticatedUsers" : [ ],
		"authenticatedUserRoles" : [ ]
	},
	"ok" : 1
}
```

A value of `1` for the `ok` field indicates success.

## Configuring MongoDB

The MongoDB configuration file is named `mongod.conf` and is located in the `/etc` directory. The file is in [YAML](https://yaml.org/) format.

The default configuration settings are sufficient for most users. However, for production environments, it is recommended to uncomment the security section and enable authorization, as shown below:

```
security:
  authorization: enabled
```

The `authorization` option enables [Role-Based Access Control \(RBAC\)](https://docs.mongodb.com/manual/core/authorization/) that regulates users access to database resources and operations. If this option is disabled, each user can access all databases and perform any action.

After editing the configuration file, restart the mongod service for changes to take effect:

```
sudo systemctl restart mongod
```

To find more information about the configuration options available in MongoDB 4.2, visit the [Configuration File Options](https://docs.mongodb.com/manual/reference/configuration-options/) documentation page.

### Creating Administrative MongoDB User

If you enabled the MongoDB authentication, you’ll need to create an administrative user that can access and manage the MongoDB instance. To do so, access the mongo shell with:

```
mongo
```

From inside the MongoDB shell, type the following command to connect to the `admin` database:

```
use admin
```

```
switched to db admin
```

Issue the following command to create a new user named `mongoAdmin` with the `userAdminAnyDatabase` role:

```
db.createUser(
  {
    user: "mongoAdmin", 
    pwd: "changeMe", 
    roles: [ { role: "userAdminAnyDatabase", db: "admin" } ]
  }
)
```

```
Successfully added user: {
	"user" : "mongoAdmin",
	"roles" : [
		{
			"role" : "userAdminAnyDatabase",
			"db" : "admin"
		}
	]
}
```

> You can name the administrative MongoDB user as you want.

Exit the mongo shell with:

```
quit()
```

To test the changes, access the mongo shell using the administrative user you have previously created:

```
mongo -u mongoAdmin -p --authenticationDatabase admin
```

Enter the password when prompted. Once you are inside the MongoDB shell connect to the `admin` database:

```
use admin
```

```
switched to db admin
```

Now, print the users with:

```
show users
```

```
{
	"_id" : "admin.mongoAdmin",
	"userId" : UUID("cdc81e0f-db58-4ec3-a6b8-829ad0c31f5c"),
	"user" : "mongoAdmin",
	"db" : "admin",
	"roles" : [
		{
			"role" : "userAdminAnyDatabase",
			"db" : "admin"
		}
	],
	"mechanisms" : [
		"SCRAM-SHA-1",
		"SCRAM-SHA-256"
	]
}
```

## Conclusion

We have shown you how to install MongoDB 4.2 on Debian 10, Buster. Visit [the MongoDB Manual](https://docs.mongodb.com/manual/) for more information on this topic.

If you hit a problem or have feedback, leave a comment below.

**版权声明**

本博客所有的转载文章，作者皆保留版权。转载必须包含本声明，保持本文完整，并以超链接形式注明作者[Linuxize](https://linuxize.com/)和本文原始地址：[https://linuxize.com/post/how-to-install-mongodb-on-debian-10/](https://linuxize.com/post/how-to-install-mongodb-on-debian-10/)

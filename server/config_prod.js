module.exports = {

    mysql: {

		host: process.env.MYSQL_HOST,
		port: process.env.MYSQL_PORT,
		user: process.env.MYSQL_USER,
		password: process.env.MYSQL_PASS,
		database: 'mysmrtdb',
		connectionLimit: 4,

		cacert: process.env.MYSQL_CA
	},
	mongodb: {
		url: process.env.MONGO_URL
	},

	gmap: {
		apikey: process.env.GMAP_KEY
	},
	
	gdest: {
		apikey: process.env.GDEST_KEY
    },
    
    passport: {
        sessionSecret: process.env.PASS_SECRET
	},
	
	pushnote: {
		private: process.env.PUSH_PRIVATE
	}
}



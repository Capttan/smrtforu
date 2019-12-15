const startTransaction = (connection) => {
	return new Promise(
		(resolve, reject) => {
			connection.beginTransaction(
				error => {
					if (error)
						return reject({ connection, error })
					resolve({ connection })
				}
			)
		}
	)
}

const mkQueryFromPool = (qObj, pool) => {
	return params => {
		return new Promise(
			(resolve, reject) => {
				pool.getConnection(
					(err, conn) => {
						if (err)
							return reject(err)
						qObj({ connection: conn, params: params || [] })
							.then(status => { resolve(status.result) })
							.catch(status => { reject(status.error) })
							.finally(() => conn.release() )
					}
				)
			}
		)
	}
}

const mkQuery = function(sql, pool) {
    const f = function(params) {
        const p = new Promise(
            (resolve, reject) => {
                pool.getConnection(
                    (err, conn) => {
                        if (err)
                            return reject(err);
                        conn.query(sql, params || [],
                            (err, result) => {
                                conn.release();
                                if (err)
                                    return reject(err);
                                resolve(result);
                            }
                        )
                    }
                )
            }
        )
        return (p);
    }
    return (f);
}

const mkQueryNoPool = function(sql) {
	return status => {
		const conn = status.connection;
		const params = status.params || [];
		console.log('sql(mkQuery): ', sql);
		console.log('params(mkQuery): ', params);
		return new Promise(
			(resolve, reject) => {
				conn.query(sql, params,
					(err, result) => {
						if (err){
							console.log('err(mkQuery): ', err);
							return reject({ connection: status.connection, error: err })
						};
						console.log('result(mkQuery): ', result);
						resolve({ connection: status.connection, result });
					}
				)
			}
		)
	}
}


const passthru = (status) => Promise.resolve(status)

const logError = (msg = "Error: ") => {
	return (status) => {
		 console.error(msg, status.error);
		 return Promise.reject(status);
	}
}

const commit = (status) => {
	return new Promise(
		(resolve, reject) => {
			const conn = status.connection;
			conn.commit(err => {
				if (err){
					console.log('commit err');
					return reject({ connection: conn, error: err });
				}
				console.log('commit ok');
				resolve({ connection: conn });
			})
		}
	)
}


const commit_result = (status) => {
	return new Promise(
		(resolve, reject) => {
			const conn = status.connection;
			conn.commit(err => {
				if (err)
					return reject({ connection: conn, error: err });
				resolve(status);
			})
		}
	)
}

const rollback = (status) => {
	return new Promise(
		(resolve, reject) => {
			const conn = status.connection;
			conn.rollback(err => {
				if (err){
					console.log('rollback err');
					return reject({ connection: conn, error: err });
				}
				console.log('rollback ok');
				reject({ connection: conn, error: status.error });
			})
		}
	)
}

module.exports = { startTransaction, mkQuery, mkQueryNoPool, commit, rollback, mkQueryFromPool, passthru, logError, commit_result };

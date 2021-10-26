module.exports = {
    mongoUri: process.env.MONGO_URI,
    port: process.env.PORT,
    jwtSecret: process.env.JWTSECRET,
    googleClientID: process.env.GID,
    googleClientSecret: process.env.GCS,
    s3AccessKeyID: process.env.S3ACCESSKEY,
    s3SecretAccessKey: process.env.S3SECRETACCESSKEY,
    stripeKey: process.env.STRIPEKEY
}
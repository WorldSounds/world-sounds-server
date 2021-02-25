module.exports = {
  apps: [
    {
      name: 'worldsounds',
      script: 'npm install && nodemon server.js',
      env: {
        REDIRECT_URI: "ec2-54-179-61-252.ap-southeast-1.compute.amazonaws.com:6300/callbacks",
        SPOTIFY_CLIENT_ID: 'd0574f1b62714617865db1237adeb779',
        SPOTIFY_CLIENT_SECRET: '9e789f302de64069be1f7d71d07ffa3b',
        PORT: 6300,
        FRONTEND_URI: 'http://worldsounds.s3-website-ap-southeast-1.amazonaws.com'
      },
    },
  ],
};

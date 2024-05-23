module.exports = ({ env }) => ({
    email: {
      config: {
        provider: 'nodemailer',
        providerOptions: {
          host: env('SMTP_HOST', ),
          port: env('SMTP_PORT', 587),
          service: 'SMTP_HOST',
          username: env('SMTP_USERNAME'),
          password: env('SMTP_PASSWORD'),
          debug: true,
          logger: true,
          secure: false,
          pool  :   true,
        },
        settings: {
          defaultFrom: env('SMTP_USERNAME', 'hello@example.com'),
          defaultReplyTo: env('SMTP_USERNAME', 'hello@example.com'),
          testAddress: env('SMTP_USERNAME', 'hello@example.com'),
        },
      }
    },
  });

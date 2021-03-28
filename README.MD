# Sanepid covid test notifier

Simple application that notifies to your email when test results are available from covid19.gyncentrum.pl/sanepid

## How to run

1. Create .env file in root with 

```
FROM=<sender_gmail>
FROM_PASSWORD=<sender_password>
TO=<receiver_email>
```

2. Run

```
node main.js <PESEL> <TEST_CODE>
```
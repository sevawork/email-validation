# Email Validation

## API Requirements

I should be able to go into the folder and type

```
npm install --save
npm start
```

And have the server run smoothly listening on port 3000.

## API Specs
The API should have one endpoint /check

User should be able to POST an email address to the API

Example

```json
{
  "email": "example@example.com"
}
```

User should receive back an object telling them whether the email is a temp email, a
misspelling, or invalid

Example

```js
{
    temp: true/false, //whether the email is a temporary email address from a throw away
    email service
    misspelled: true/false // true if the email is a likely misspelling of a popular email service
    like gmail, hotmail, send back what we think it should be
    autocorrect: if misspelled is false then this is null, if it is true, then return what we think
    the correct spelling should be.
    invalid: true/false, //whether the email is invalid, we will do this by checking the DNS MX
    records
}
```

## Implementation

`temp` is using `burner-email-providers` package which includes curated list of temp email providers

`mispelled` is solved by comparing Levenshtein distance between given email and one of top 100 email providers domains (using `fast-levelnstein` package)

`invalid` is checking email with regexp, when matches regexp it performs DNS request using native `dns` module

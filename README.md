# wingmaite Code Challange

This code challange is comprised of multiple exercises aimed to understand:

- Code Skills
- Abstract thinking and problem solving
- Database Modeling
- Testing skill

# Exercise 1 - User Management

The project provides and API with three endpoints which allow an admin to manage users:

- POST /users
- GET /users/:id
- PUT /users/:id

There are several problems with the implementation:

- The users are only saved in memory, and wipes when the app restarts.
- The endpoints are leaking sensitive data in the response.
- The request and response bodies should work with snake case attributes but are working with camelCase.

Please implement fixes for all of the above problems. Also, implement unit tests for the endpoints.
In the case of the persistent storage we expect to see an SQL based solution (can be an file storage SQL solution).

Related files:

- All folders and files inside the `src/users` folder.

## Exercise 2 - HMAC Authentication

Implement an HMAC-based authentication system that validates incoming HTTP requests by comparing cryptographic signatures.

### Overview

The authentication works by:

Constructing a specific string from request components
Generating an HMAC-SHA256 hash of this string
Comparing the generated hash with the signature provided in the request headers
Accepting the request only if the signatures match

### Required Request Headers

Every authenticated request must include these headers:

`X-Access-Key-Id`: The API key identifier  
`X-Signature-Version`: Version of the signature algorithm (currently "1")  
`X-Signature`: The HMAC-SHA256 signature of the request  
`X-Timestamp`: Request timestamp in ISO 8601 format (e.g., 2023-01-30T15:07:22+00:00)

### Constructing the String to Sign

Build the string to sign by concatenating the following components, <u>**each separated by a newline character (\n)**</u>:

**HTTP Method** (lowercase) - e.g., "get", "post", "put"  
**Host Header Value** (lowercase) - e.g., "example.org"  
**Timestamp** - Value from X-Timestamp header  
**Request Path** - The URI path, e.g., "/some_endpoint"  
**Query String** (optional) - Canonicalized\* query parameters (only if present)  
**Request Body** (optional) - Raw request body (only if present)

## \* Canonicalized in this case, means:

**Alphabetical Ordering:** Parameters are sorted alphabetically by key name

Before: ?size=large&color=red&brand=nike  
After: ?brand=nike&color=red&size=large

**Encoding Consistency:** Using consistent percent-encoding

Before: ?name=John+Doe&city=New York
After: ?name=John%20Doe&city=New%20York

**Removing Duplicates:** Handling repeated parameters consistently

Before: ?tag=red&tag=blue&tag=red
After: ?tag=blue&tag=red (deduplicated and sorted)

**New Line per key-value pair:**

Before: ?tag=red&tag=blue&tag=yellow
After:  
tag=red
&tag=blue
&tag=yellow

#### Example 1 - POST Request

**Request:**

```
POST /some_endpoint HTTP/1.1
Host: example.org
X-Access-Key-Id: SOME_API_KEY
X-Signature-Version: 1
X-Signature: [sha256_signed_string]
X-Timestamp: 2023-01-30T15:07:22+00:00
Content-Type: application/json

{"foo":"bar"}
```

**String to Sign:**

```
post
example.org
2023-01-30T15:07:22+00:00
/some_endpoint
{"foo":"bar"}
```

**Signature Generation:**

```
signature = HMAC-SHA256(string_to_sign, secret_key)
```

#### Example 2 - GET Request

**Request:**

```
GET /some_endpoint?search=abc&page=1&page_size=100 HTTP/1.1
Host: example.org
X-Access-Key-Id: SOME_API_KEY
X-Signature-Version: 1
X-Signature: [sha256_signed_string]
X-Timestamp: 2023-01-30T15:07:22+00:00
Content-Type: application/json
```

**String to Sign:**

```
get
example.org
2023-01-30T15:07:22+00:00
/some_endpoint
page=1
&page_size=100
&search=abc
```

**Signature Generation:**

```
signature = HMAC-SHA256(string_to_sign, secret_key)
```

### Implementation Requirements

#### Your implementation should:

- Implement the `validate` method in the `hmac.strategy.ts` file
- Pass all the tests in the `hmac.strategy.spec.ts`
- Extract all required headers from incoming requests
- Construct the string to sign according to the format above
- Generate the HMAC-SHA256 signature using the API secret key
- Compare the generated signature with the X-Signature header
- Accept requests with matching signatures, reject all others
- Reject the request even if the signature is correct, if the request is more than 1 minute old.

### Notes

- All string comparisons should be case-sensitive except where specified
- The query string canonicalization should follow standard URL encoding rules
- Empty request bodies should not add an extra newline at the end

Related files:

- All folders and files inside the `src/auth` folder.

# Exercise 3 - RxJS

The API provides an endpoint GET /events that returns a list of events collected from an event stream.
Currently the implementation is lacking because it only returns the last event object.
Fix the code, by making sure the related unit test passes.

Related files:

- All folders and files inside the `src/events` folder.

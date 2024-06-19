## Demo

https://www.loom.com/share/caae1860a78f4e6faf87ecc5678d1b2d

## How to start the app

1. Clone the repo
2. Type `npm i` once cloned.
3. Run `npm run start` to begin the script.
4. Test data output should be in `src/output.json`.
5. Run `npm run test` to run the test suite created.

## Things to know

1. File organization is supposed to roughly emulate what a real project would look like.

- Files within the `db/*` folder are supposed to emulate controllers but for the purpose of this exercise the "db" is either on object or an array to emulate our DB.
- Typescript was added to try and get a sense of DB schema as well as having cleaner code written out.

2. Files within the tests folder are supposed to roughly emulate the project structure within `src/`
3. This system assumes no contributions are made after a distribution. Different logic needs to be written out for this case.
4. Preferred Returns are calculated based off each contribution made prior to the first distribution. Not 100% sure if this is the right behavior we'd want.
5. The `starting_capital` represents the cumulative sum of all distributions for a distribution we want to calculate the waterfall on.
6. More tests need to be written out but I made brief comments on what I would be testing for.
7. Anywhere you see `console.error` would ideally be for 3rd party error reporting but I put that there temporarily to showcase where I think error reporting would go.

## Proposed Architecture for the Future

Initially, I was going to set this project up by implementing postgres, Prisma, and NextJS to showcase a bit more of a fully functioning app.

What's nice about Prisma for our use case here is that you can emulate DB routines so in the future if we ever wanted to change the value of a contribution amount, we can automatically re-calculate the entire waterfall calculations. Prisma also gives us pre-built types based off your DB schema which would eliminate a lot of overhead with creating my own DB types (lots of tradeoffs with this one but over the years I've learned to adapt how to best use pre build prisma types).

The way this data is structured, a RDB seemed to have made more sense considering the relationship between commitments and transactions. Even in the example data, conceptually, there was a foreign key within the transactions table.

Lastly, I would've loved to use NextJS to show a simple UI of a table that would've looked similar to the example shown in the prompt. Server side rendering could definitely be used here if this was a mature app as there would be a lot of data fetches involved in initially loading up user data whenever they would want to see a dashboard of their waterfall calculations.

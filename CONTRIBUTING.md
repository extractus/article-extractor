# Contributing to `@extractus/article-extractor`

Glad to see you here.

Collaborations and pull requests are always welcomed, though larger proposals should be discussed first.

As an OSS, it's better to follow the Unix philosophy: "do one thing and do it well".

## Third-party libraries

Please avoid using libaries other than those available in the standard library, unless necessary.

This library needs to be simple and flexible to run on multiple platforms (Deno, Node, Bun).

## Coding convention

Make sure your code lints before opening a pull request.


```bash
cd article-extractor

# check coding convention issue
deno lint

# auto fix coding convention issue
deno lint --fix
```

## Testing

Be sure to run the unit test suite before opening a pull request. An example test run is shown below.

```bash
cd article-extractor
deno test --allow-all
```

## Clean commit histories

When you open a pull request, please ensure the commit history is clean.
Squash the commits into logical blocks, perhaps a single commit if that makes sense.

What you want to avoid is commits such as "WIP" and "fix test" in the history.
This is so we keep history on master clean and straightforward.

## License

By contributing to `@extractus/article-extractor`, you agree that your contributions will be licensed under its [MIT license](LICENSE).

---

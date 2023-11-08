
This repository contains a collection of different code transformations (from compilers, transpilers, etc), that we are interested in exploring and supporting with the SourceMap "Scopes" proposal.

[https://github.com/tc39/source-map-rfc/blob/main/proposals/scopes.md](https://github.com/tc39/source-map-rfc/blob/main/proposals/scopes.md)

## Scopes in SourceMaps

The "scopes" fields in the source map files of this repo are currently hand-crafted. Each *.map file contains an accompanying "scopes.json" which contains the scope information
in a human readable/editable format. A small node script takes the "scopes.json" and encodes it into the source map according to the current spec.

## usage

Dependencies: Node 16+, npm, Docker

1. Get pnpm: `npm install -g pnpm`
2. `pnpm start`
3. navigate to [localhost:4567](http://localhost:4567)

## regenerating proto outputs

Dependencies: Python 3, `protoc` on path

1. `npm i -g protoc-gen-ts`
2. `cd proto`
3. `python generate.py`

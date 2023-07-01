## usage

Dependencies: Node 16+, npm, Docker

1. Get pnpm: `npm install -g pnpm`
2. `pnpm start`
3. navigate to [localhost:4567](http://localhost:4567)

## development

- The server and client support hot-reloading.
  - The client has hot module replacement via Parcel
  - The server will be recompiled and restarted when changes occur

## regenerating proto outputs

Dependencies: Python 3, `protoc` on path

1. `npm i -g protoc-gen-ts`
2. `cd proto`
3. `python generate.py`

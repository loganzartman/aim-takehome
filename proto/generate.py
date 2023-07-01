import os
import subprocess
import tempfile
import shutil

PROTOC_GEN_TS_PATH = os.path.join('.', 'node_modules', '.bin', 'protoc-gen-ts')

def generate_web(proto_path: str, output_dir: str):
  with tempfile.TemporaryDirectory() as tmp_dir:
    command = 'protoc'\
      f' -I={proto_path}'\
      f' {os.path.join(proto_path, "*.proto")}'\
      f' --ts_opt=target=web'\
      f' --ts_out={tmp_dir}'\
      # f' --grpc-web_out=mode=grpcwebtext:{tmp_dir}'''\
      # f' --js_out="import_style=commonjs,binary:{tmp_dir}"'\
    # this line intentionally left blank
    print('running:', command)
    subprocess.run(command, shell=True)
    if os.path.exists(output_dir):
      shutil.rmtree(output_dir)
    os.rename(tmp_dir, output_dir)

if __name__ == "__main__":
  proto_path = '.'
  generate_web(proto_path, os.path.join('..', 'src', 'client', 'proto-generated'))

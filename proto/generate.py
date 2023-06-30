import os
import subprocess
import tempfile
import shutil

PROTOC_GEN_TS_PATH = os.path.join('.', 'node_modules', '.bin', 'protoc-gen-ts')

def generate_code(proto_path, output_dir):
    with tempfile.TemporaryDirectory() as tmp_dir:
        command = 'protoc'\
            f' --plugin="protoc-gen-ts={PROTOC_GEN_TS_PATH}"'\
            f' -I={proto_path}'\
            f' --js_out="import_style=commonjs,binary:{tmp_dir}"'\
            f' --grpc-web_out=mode=grpcwebtext:{tmp_dir}'''\
            f' {os.path.join(proto_path, "*.proto")}'\
            # f' --ts_out={tmp_dir}'\
        # this line intentionally left blank
        print('running:')
        print(command)
        subprocess.run(command, shell=True)
        if os.path.exists(output_dir):
            shutil.rmtree(output_dir)
        os.rename(tmp_dir, output_dir)

if __name__ == "__main__":
    proto_path = '.'
    output_dir = os.path.join('..', 'src', 'proto-generated')
    generate_code(proto_path, output_dir)

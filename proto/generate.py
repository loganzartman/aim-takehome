import os
import subprocess
import shutil
import tempfile

def generate_js_code(proto_path, output_dir):
    with tempfile.TemporaryDirectory() as tmp_dir:
        command = f'protoc -I={proto_path} {os.path.join(proto_path, "*.proto")} --js_out=import_style=commonjs:{tmp_dir} --grpc-web_out=import_style=commonjs,mode=grpcwebtext:{output_dir}'
        subprocess.run(command, shell=True)
        shutil.move(tmp_dir, output_dir)

if __name__ == "__main__":
    proto_path = '.'
    output_dir = os.path.join('..', 'src', 'proto-generated')
    generate_js_code(proto_path, output_dir)

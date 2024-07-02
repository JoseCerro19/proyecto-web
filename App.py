from flask import Flask, request
from main import insert_table_u 

app = Flask(__name__)



dato = ('diego', 'vazquez', 'diegovazque@unibarranquilla.edu.co', '123456')


insert_table_u(dato)
@app.route('/register', methods=['POST'])
def registro_usuario():
    try:
        data=request.get_json()
        nombre=data.get('nombre')
        apellido=data.get('apellido')
        correo=data.get('correo')
        contraseña=data.get('contraseña')

        dato=(nombre, apellido, correo, contraseña)
        insert_table_u(dato)
    except Exception as ex:
        print('error: ',ex)
        return ex

@app.route('/prueba')
def prueba():
    return 'hola ojse'

if __name__ == "__main__":
    app.run(debug=True)

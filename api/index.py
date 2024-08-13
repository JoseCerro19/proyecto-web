from flask import Flask, request, jsonify, session
import pymysql
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

# Configuración de la base de datos
db_config = {
    'host': 'bhe7eywp18ocpd44bphu-mysql.services.clever-cloud.com',
    'user': 'ue1hxs60dwhs48mr',
    'password': 'uPC021wEA2256mLjNBTR',
    'db': 'bhe7eywp18ocpd44bphu',
    'cursorclass': pymysql.cursors.DictCursor  # Usar diccionarios para facilitar el manejo de resultados
}

def get_db_connection():
    return pymysql.connect(**db_config)

def VerificarExistencia_u(correo):
    try:
        connection = get_db_connection()
        with connection.cursor() as cursor:
            cursor.execute("SELECT email FROM usuarios WHERE email = %s", (correo,))
            user = cursor.fetchone()
        
        connection.close()
        return bool(user)
    except Exception as e:
        print("Error al verificar la existencia del correo:", e)
        return False

def InsertInTable_U(datos):
    try:
        connection = get_db_connection()
        with connection.cursor() as cursor:
            cursor.execute("""
                INSERT INTO usuarios (nombre, apellido, email, contraseña, rol) 
                VALUES (%s, %s, %s, %s, %s)
            """, datos)
            connection.commit()
        
        connection.close()
        print("Datos insertados correctamente.")
        return True
    except Exception as e:
        print("Error al insertar datos:", e)
        return False

def Verificar_u(email, password):
    try:
        connection = get_db_connection()
        with connection.cursor() as cursor:
            cursor.execute("SELECT id, nombre, apellido, email, contraseña, rol FROM usuarios WHERE email = %s AND contraseña = %s", (email, password))
            user = cursor.fetchone()
        
        connection.close()
        return user
    except Exception as e:
        print("Error al verificar las credenciales:", e)
        return False

@app.route('/register', methods=['POST'])
def register():
    try:
        data = request.get_json()
        nombre = data.get('nombre')
        apellido = data.get('apellido')
        email = data.get('email')
        contra = data.get('contra')
        rol = data.get('rol')
        
        if VerificarExistencia_u(email):
            return jsonify(success=False, message="Las credenciales usadas ya se encuentran registradas.")
        else:
            datos = (nombre, apellido, email, contra, rol)
            if InsertInTable_U(datos):
                return jsonify(success=True, message="Se ha registrado de manera exitosa.")
            else:
                return jsonify(success=False, message="Ocurrió un error al registrar los datos.")
    except Exception as e:
        print(e)
        return jsonify(success=False, message="Error interno del servidor.")

@app.route('/valiDato', methods=['POST'])
def validate():
    try:
        data = request.get_json()
        email = data.get('email')
        contra = data.get('contra')
        print(email, contra)
        
        user = Verificar_u(email, contra)
        
        if user: 
            return jsonify(success=True, message="Inicio de sesion exitoso", id=user['id'], nombre=user['nombre'], apellido=user['apellido'], email=user['email'], rol=user['rol'])
        else:
            return jsonify(success=False, message="Correo electrónico o contraseña incorrectos.")
    except Exception as e:
        print(e)
        return jsonify(success=False, message="Error interno del servidor.")

@app.route('/getAll', methods=['GET'])
def getAll():
    try:
        connection = get_db_connection()
        with connection.cursor() as cursor:
            cursor.execute("SELECT * FROM usuarios")
            results = cursor.fetchall()

        connection.close()
        payload = [{"id": i["id"], "nombre": i["nombre"], "apellido": i["apellido"], "email": i["email"], "contraseña": i["contraseña"], "rol": i["rol"]} for i in results]
        
        return jsonify({"Usuarios": payload})
    except Exception as e:
        print(e)
        return jsonify(success=False, message="Error al obtener usuarios desde la base de datos.")

@app.route('/getAll/<id>', methods=['GET'])
def getAllById(id):
    try:
        connection = get_db_connection()
        with connection.cursor() as cursor:
            cursor.execute('SELECT * FROM usuarios WHERE id = %s', (id,))
            rv = cursor.fetchall()

        connection.close()
        payload = [{"id": i["id"], "nombre": i["nombre"], "apellido": i["apellido"], "email": i["email"], "contraseña": i["contraseña"], "rol": i["rol"]} for i in rv]
        
        return jsonify(payload)
    except Exception as e:
        print(e)
        return jsonify({"informacion": str(e)})

@app.route('/obtener_detalles', methods=['POST'])
def obtenerDetalles():
    try:
        data = request.get_json()
        correo = data['correo']

        connection = get_db_connection()
        with connection.cursor() as cursor:
            cursor.execute('SELECT * FROM usuarios WHERE email = %s', (correo,))
            rv = cursor.fetchall()

        connection.close()

        if rv:
            usuario = {
                "id": rv[0]["id"],
                "nombre": rv[0]["nombre"],
                "apellido": rv[0]["apellido"],
                "email": rv[0]["email"],
                "contraseña": rv[0]["contraseña"],
                "biografia": rv[0]["biografia"]
            }
            return jsonify(usuario)
        else:
            return jsonify({"mensaje": "Usuario no encontrado"}), 404

    except Exception as e:
        print(e)
        return jsonify({"informacion": str(e)}), 500

@app.route('/editUser/<user_id>', methods=['PUT'])
def editUser(user_id):
    try:
        data = request.get_json()

        nombre = data.get('nombre')
        apellido = data.get('apellido')
        email = data.get('email')
        contraseña = data.get('contraseña')
        rol = data.get('rol')

        connection = get_db_connection()
        with connection.cursor() as cursor:
            cursor.execute("""
                UPDATE usuarios
                SET nombre = %s, apellido = %s, email = %s, contraseña = %s, rol = %s
                WHERE id = %s
            """, (nombre, apellido, email, contraseña, rol, user_id))
            connection.commit()

        connection.close()
        return jsonify(success=True, message=f"Usuario con ID {user_id} actualizado correctamente")

    except Exception as e:
        print(e)
        return jsonify(success=False, message="Error al actualizar el usuario"), 500

@app.route('/actualizar_usuario', methods=['PUT'])
def actualizar_usuario():
    try:
        data = request.get_json()
        nombre = data['nombre']
        apellido = data['apellido']
        email = data['email']
        contraseña = data['contraseña']
        bio = data['bio']

        connection = get_db_connection()
        with connection.cursor() as cursor:
            cursor.execute("""
                UPDATE usuarios 
                SET nombre = %s, apellido = %s, contraseña = %s, biografia = %s
                WHERE email = %s
            """, (nombre, apellido, contraseña, bio, email))
            connection.commit()

        connection.close()
        return jsonify({"mensaje": "Datos actualizados correctamente"}), 200

    except Exception as e:
        print(e)
        return jsonify({"informacion": str(e)}), 500

@app.route('/user-stats', methods=['GET'])
def user_stats():
    try:
        connection = get_db_connection()
        with connection.cursor() as cursor:
            cursor.execute('''
                SELECT rol, COUNT(*) as cantidad
                FROM usuarios
                GROUP BY rol
            ''')
            results = cursor.fetchall()

        connection.close()
        roles = [row["rol"] for row in results]
        counts = [row["cantidad"] for row in results]

        return jsonify({'roles': roles, 'counts': counts})
    except Exception as e:
        print(e)
        return jsonify(success=False, message="Error al obtener estadísticas de usuarios."), 500

# FORO  
@app.route('/publicaciones', methods=['POST'])
def crear_publicacion():
    try:
        data = request.get_json()
        contenido = data.get('contenido')
        id_usuario = data.get('id_usuario')

        connection = get_db_connection()
        with connection.cursor() as cursor:
            cursor.execute("""
                INSERT INTO publicaciones (contenido, id_usuario)
                VALUES (%s, %s)
            """, (contenido, id_usuario))
            connection.commit()

        connection.close()
        return jsonify(success=True, message='Publicación creada'), 201

    except Exception as e:
        print(e)
        return jsonify(success=False, message='Error al crear la publicación'), 500

@app.route('/publicaciones', methods=['GET'])
def obtener_publicaciones():
    try:
        connection = get_db_connection()
        with connection.cursor() as cursor:
            cursor.execute("""
                SELECT p.id_publi, p.contenido, u.nombre, u.apellido, p.fecha, p.id_usuario
                FROM publicaciones p
                JOIN usuarios u ON p.id_usuario = u.id
                ORDER BY p.fecha DESC
            """)
            publicaciones = cursor.fetchall()

        connection.close()
        return jsonify(publicaciones), 200
    except Exception as e:
        print(e)
        return jsonify(success=False, message='Error al obtener las publicaciones'), 500

@app.route('/eliminar_publicaciones/<int:id_publi>', methods=['DELETE'])
def eliminar_publicacion(id_publi):
    try:
        connection = get_db_connection()
        with connection.cursor() as cursor:
            cursor.execute("DELETE FROM publicaciones WHERE id_publi = %s", (id_publi,))
            connection.commit()

        connection.close()
        return jsonify(success=True, message='Publicación eliminada'), 200
    except Exception as e:
        print(e)
        return jsonify(success=False, message='Error al eliminar la publicación'), 500

@app.route('/editar_publicaciones/<int:id_publi>', methods=['PUT'])
def editar_publicacion(id_publi):
    try:
        data = request.get_json()
        nuevo_contenido = data.get('contenido')

        connection = get_db_connection()
        with connection.cursor() as cursor:
            cursor.execute("""
                UPDATE publicaciones
                SET contenido = %s
                WHERE id_publi = %s
            """, (nuevo_contenido, id_publi))
            connection.commit()

        connection.close()
        return jsonify(success=True, message='Publicación actualizada'), 200

    except Exception as e:
        print(e)
        return jsonify(success=False, message='Error al editar la publicación'), 500

if __name__ == '__main__':
    app.run(debug=True)

from flask import Flask, request, jsonify, session
from flask_mysqldb import MySQL
from flask_cors import CORS

app = Flask(__name__)
app.config['MYSQL_HOST'] = 'localhost'
app.config['MYSQL_USER'] = 'root'
app.config['MYSQL_PASSWORD'] = ''
app.config['MYSQL_DB'] = 'jd'

CORS(app, resources={r"/*": {"origins": "http://127.0.0.1:3000"}}, supports_credentials=True)
CORS(app, resources={r"/*/*": {"origins": "http://127.0.0.1:3000"}},supports_credentials=True)

mySql = MySQL(app)

def VerificarExistencia_u(correo):
    try:
        cursor = mySql.connection.cursor()
        cursor.execute("SELECT email FROM usuarios WHERE email = %s", (correo,))
        user = cursor.fetchone()
        cursor.close()
        
        if user:
            return True
        else:
            return False
    except Exception as e:
        print("Error al verificar la existencia del correo:", e)
        return False

def InsertInTable_U(datos):
    try:
        cursor = mySql.connection.cursor()
        
        cursor.execute("""
            INSERT INTO usuarios (nombre, apellido, email, contraseña, rol) 
            VALUES (%s, %s, %s, %s,%s)
        """, datos)
        
        mySql.connection.commit()
        cursor.close()
        
        print("Datos insertados correctamente.")
        return True

    except Exception as e:
        print("Error al insertar datos:", e)
        return False

def Verificar_u(email, password):
    try:
        cursor = mySql.connection.cursor()
        cursor.execute("SELECT  id,nombre,apellido,email,contraseña,rol FROM usuarios WHERE email = %s AND contraseña = %s", (email, password))
        user = cursor.fetchone()
        cursor.close()
        
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
        rol=data.get('rol')
        
        if VerificarExistencia_u(email):
            return jsonify(success=False, message="Las credenciales usadas ya se encuentran registradas.")
        else:
            datos = (nombre, apellido, email, contra,rol)
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
        print(email,contra)
        
        user = Verificar_u(email, contra)
        
        if user: 
            return jsonify(success=True, message="Inicio de sesion exitoso",id=user[0],nombre=user[1],apellido=user[2],email=user[3],rol=user[5])
        
        else:
            return jsonify(success=False, message="Correo electrónico o contraseña incorrectos.")
    except Exception as e:
        print(e)
        return jsonify(success=False, message="Error interno del servidor.")

@app.route('/getAll', methods=['GET'])
def getAll():
    try:
        cur = mySql.connection.cursor()
        cur.execute("SELECT * FROM usuarios")
        
        results = cur.fetchall()
        payload = []
        print(results)

        for i in results:
            content = {"id": i[0], "nombre": i[1], "apellido":i[2], "email": i[3], "contraseña": i[4],"rol": i[5] }
            payload.append(content)
        cur.close()
        return jsonify({"Usuarios": payload})
    
    except Exception as e:
        print(e)
        return jsonify(success=False,message="Error al obtener usuarios desde la base de datos.")

@app.route('/getAll/<id>', methods=['GET'])
def getAllById(id):
    try:
        cur = mySql.connection.cursor()
        cur.execute('SELECT * FROM usuarios WHERE id = %s', (id,))
        rv = cur.fetchall()
        cur.close()
        payload = []
        for i in rv:
            content = {
                "id": i[0],
                "nombre": i[1],
                "apellido": i[2],
                "email": i[3],
                "contraseña": i[4],
                "rol": i[5]
            }
            payload.append(content)
        return jsonify(payload)
    except Exception as e:
        print(e)
        return jsonify({"informacion": str(e)})
    
@app.route('/obtener_detalles', methods=['POST'])
def obtenerDetalles():
    try:
        data = request.get_json()
        correo = data['correo']
        cur = mySql.connection.cursor()
        cur.execute('SELECT * FROM usuarios WHERE email = %s', (correo,))
        rv = cur.fetchall()
        cur.close()

        if rv:
            usuario = {
                "id": rv[0][0],
                "nombre": rv[0][1],
                "apellido": rv[0][2],
                "email": rv[0][3],
                "contraseña": rv[0][4],
                "biografia": rv[0][6]
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
        cur = mySql.connection.cursor()
        data = request.get_json()

        nombre = data.get('nombre')
        apellido = data.get('apellido')
        email = data.get('email')
        contraseña = data.get('contraseña')
        rol = data.get('rol')

        cur.execute("""
            UPDATE usuarios
            SET nombre = %s, apellido = %s, email = %s, contraseña = %s, rol = %s
            WHERE id = %s
        """, (nombre, apellido, email, contraseña, rol, user_id))
        
        mySql.connection.commit()
        cur.close()

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

        cur = mySql.connection.cursor()
        cur.execute("""
            UPDATE usuarios 
            SET nombre = %s, apellido = %s, contraseña = %s, biografia = %s
            WHERE email = %s
        """, (nombre, apellido, contraseña, bio, email))
        mySql.connection.commit()
        cur.close()

        return jsonify({"mensaje": "Datos actualizados correctamente"}), 200

    except Exception as e:
        print(e)
        return jsonify({"informacion": str(e)}), 500

@app.route('/user-stats', methods=['GET'])
def user_stats():
    try:
        cur = mySql.connection.cursor()
        cur.execute('''
            SELECT rol, COUNT(*) as cantidad
            FROM usuarios
            GROUP BY rol
        ''')
        results = cur.fetchall()
        cur.close()

        # Preparar datos para la gráfica
        roles = []
        counts = []

        for row in results:
            roles.append(row[0])
            counts.append(row[1])

        return jsonify({
            'roles': roles,
            'counts': counts
        })
    except Exception as e:
        print(e)
        return jsonify(success=False, message="Error al obtener estadísticas de usuarios."), 500

    
#FORO  
@app.route('/publicaciones', methods=['POST'])
def crear_publicacion():
    try:
        data = request.get_json()
        contenido = data.get('contenido')
        id_usuario = data.get('id_usuario')

        cur = mySql.connection.cursor()
        cur.execute("""
            INSERT INTO publicaciones (contenido, id_usuario)
            VALUES (%s, %s)
        """, (contenido, id_usuario))
        mySql.connection.commit()
        cur.close()

        return jsonify(success=True, message='Publicación creada'), 201

    except Exception as e:
        print(e)
        return jsonify(success=False, message='Error al crear la publicación'), 500

# Ruta para obtener todas las publicaciones
@app.route('/publicaciones', methods=['GET'])
def obtener_publicaciones():
    try:
        cur = mySql.connection.cursor()
        cur.execute("""
            SELECT p.id_publi, p.contenido, u.nombre, u.apellido, p.fecha, p.id_usuario
            FROM publicaciones p
            JOIN usuarios u ON p.id_usuario = u.id
        """)
        publicaciones = cur.fetchall()
        cur.close()

        resultado = []
        for publi in publicaciones:
            resultado.append({
                'id_publi': publi[0],
                'contenido': publi[1],
                'nombre_usuario': f"{publi[2]} {publi[3]}",
                'fecha': publi[4],
                'id_usuario': publi[5]  # Añadir el id_usuario aquí
            })
        print(resultado)
        return jsonify(resultado), 200

    except Exception as e:
        print(e)
        return jsonify(success=False, message='Error al obtener las publicaciones'), 500

# Ruta para crear una nueva respuesta
@app.route('/respuestas', methods=['POST'])
def crear_respuesta():
    try:
        data = request.get_json()
        contenido = data.get('contenido')
        publicacion_id = data.get('publicacion_id')
        id_usuario = data.get('id_usuario')

        if not contenido or not publicacion_id or not id_usuario:
            return jsonify(success=False, message='Faltan datos requeridos'), 400

        cur = mySql.connection.cursor()
        cur.execute("""
            INSERT INTO respuestas (contenido, publicacion_id, id_usuario)
            VALUES (%s, %s, %s)
        """, (contenido, publicacion_id, id_usuario))
        mySql.connection.commit()
        cur.close()

        return jsonify(success=True, message='Respuesta creada'), 201

    except Exception as e:
        print(f"Error al crear la respuesta: {e}")
        return jsonify(success=False, message='Error al crear la respuesta'), 500


# Ruta para obtener todas las respuestas de una publicación específica
@app.route('/publicaciones/<int:id_publi>/respuestas', methods=['GET'])
def obtener_respuestas(id_publi):
    try:
        cur = mySql.connection.cursor()
        cur.execute("""
            SELECT r.id, r.contenido, u.nombre, u.apellido, r.fecha
            FROM respuestas r
            JOIN usuarios u ON r.id_usuario = u.id
            WHERE r.publicacion_id = %s
        """, (id_publi,))
        respuestas = cur.fetchall()
        cur.close()

        resultado = []
        for resp in respuestas:
            resultado.append({
                'id': resp[0],
                'contenido': resp[1],
                'nombre_usuario': f"{resp[2]} {resp[3]}",
                'fecha': resp[4]
            })
        
        return jsonify(resultado), 200

    except Exception as e:
        print(e)
        return jsonify(success=False, message='Error al obtener las respuestas'), 500
    
#BOTONES DE ELIMINAR Y EDITAR PUBLICACIONES Y RESPUESTAS
@app.route('/eliminar_publicaciones/<int:id_publi>', methods=['DELETE'])
def eliminar_publicacion(id_publi):
    try:
        data = request.get_json()
        id_usuario = data.get('id_usuario')

        # Verificar que la publicación exista y obtener el ID del usuario que la creó
        cur = mySql.connection.cursor()
        cur.execute("SELECT id_usuario FROM publicaciones WHERE id_publi = %s", (id_publi,))
        publicacion = cur.fetchone()

        if not publicacion:
            return jsonify(success=False, message='Publicación no encontrada'), 404

        if publicacion[0] != id_usuario:
            return jsonify(success=False, message='No tienes permisos para eliminar esta publicación'), 403

        # Eliminar la publicación
        cur.execute("DELETE FROM publicaciones WHERE id_publi = %s", (id_publi,))
        mySql.connection.commit()
        cur.close()

        return jsonify(success=True, message='Publicación eliminada'), 200

    except Exception as e:
        print(f"Error al eliminar la publicación: {e}")
        return jsonify(success=False, message='Error al eliminar la publicación'), 500

@app.route('/editar_publicaciones/<int:id_publi>', methods=['PUT'])
def editar_publicacion(id_publi):
    try:
        data = request.get_json()
        contenido = data.get('contenido')
        id_usuario = data.get('id_usuario')

        # Verificar que la publicación exista y obtener el ID del usuario que la creó
        cur = mySql.connection.cursor()
        cur.execute("SELECT id_usuario FROM publicaciones WHERE id_publi = %s", (id_publi,))
        publicacion = cur.fetchone()

        if not publicacion:
            return jsonify(success=False, message='Publicación no encontrada'), 404

        # Verificar el rol del usuario
        cur.execute("SELECT rol FROM usuarios WHERE id = %s", (id_usuario,))
        usuario = cur.fetchone()
        
        if not usuario:
            return jsonify(success=False, message='Usuario no encontrado'), 404

        rol_usuario = usuario[0]

        # Permitir la edición solo si el usuario es el autor o si es administrador
        if publicacion[0] != id_usuario and rol_usuario != 'administrador':
            return jsonify(success=False, message='No tienes permisos para editar esta publicación'), 403

        # Actualizar la publicación
        cur.execute("""
            UPDATE publicaciones 
            SET contenido = %s 
            WHERE id_publi = %s
        """, (contenido, id_publi))
        mySql.connection.commit()
        cur.close()

        return jsonify(success=True, message='Publicación actualizada'), 200

    except Exception as e:
        print(f"Error al editar la publicación: {e}")
        return jsonify(success=False, message='Error al editar la publicación'), 500

#RESPUESTAS
@app.route('/eliminar_respuestas/<int:id_respuesta>', methods=['DELETE'])
def eliminar_respuesta(id_respuesta):
    try:
        data = request.get_json()
        id_usuario = data.get('id_usuario')

        # Verificar que la respuesta exista y obtener el ID del usuario que la creó
        cur = mySql.connection.cursor()
        cur.execute("SELECT id_usuario FROM respuestas WHERE id = %s", (id_respuesta,))
        respuesta = cur.fetchone()

        if not respuesta:
            return jsonify(success=False, message='Respuesta no encontrada'), 404

        if respuesta[0] != id_usuario:
            return jsonify(success=False, message='No tienes permisos para eliminar esta respuesta'), 403

        # Eliminar la respuesta
        cur.execute("DELETE FROM respuestas WHERE id = %s", (id_respuesta,))
        mySql.connection.commit()
        cur.close()

        return jsonify(success=True, message='Respuesta eliminada'), 200

    except Exception as e:
        print(f"Error al eliminar la respuesta: {e}")
        return jsonify(success=False, message='Error al eliminar la respuesta'), 500

@app.route('/editar_respuestas/<int:id_respuesta>', methods=['PUT'])
def editar_respuesta(id_respuesta):
    try:
        data = request.get_json()
        nuevo_contenido = data.get('contenido')
        id_usuario = data.get('id_usuario')

        if not nuevo_contenido:
            return jsonify(success=False, message='Contenido requerido'), 400

        # Verificar que la respuesta exista y obtener el ID del usuario que la creó
        cur = mySql.connection.cursor()
        cur.execute("SELECT id_usuario FROM respuestas WHERE id = %s", (id_respuesta,))
        respuesta = cur.fetchone()

        if not respuesta:
            return jsonify(success=False, message='Respuesta no encontrada'), 404

        # Verificar el rol del usuario
        cur.execute("SELECT rol FROM usuarios WHERE id = %s", (id_usuario,))
        usuario = cur.fetchone()
        
        if not usuario:
            return jsonify(success=False, message='Usuario no encontrado'), 404

        rol_usuario = usuario[0]

        # Permitir la edición solo si el usuario es el autor o si es administrador
        if respuesta[0] != id_usuario and rol_usuario != 'administrador':
            return jsonify(success=False, message='No tienes permisos para editar esta respuesta'), 403

        # Actualizar la respuesta
        cur.execute("""
            UPDATE respuestas
            SET contenido = %s
            WHERE id = %s
        """, (nuevo_contenido, id_respuesta))
        mySql.connection.commit()
        cur.close()

        return jsonify(success=True, message='Respuesta actualizada'), 200

    except Exception as e:
        print(f"Error al actualizar la respuesta: {e}")
        return jsonify(success=False, message='Error al actualizar la respuesta'), 500

if __name__ == '__main__':
    app.run(debug=True)





import mysql.connector as sql




Db_Config={
    'host':'bvlkiwtev7f2kscowue2-mysql.services.clever-cloud.com',
    'database':'bvlkiwtev7f2kscowue2',
    'user':'uw0nr5rrktdg5gqz',
    'password':'5xsRUZ9YmHi7bVD7unG2',
    'port': 3306,
}



def insert_table_u(datos):
    try:
        conn = sql.connect(**Db_Config)
        cursor = conn.cursor()
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS registro (
                id INT AUTO_INCREMENT,
                nombre TEXT NOT NULL,
                apellido TEXT NOT NULL,
                correo VARCHAR(255) NOT NULL UNIQUE,
                contraseña TEXT NOT NULL,
                fecha TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
                PRIMARY KEY (id)
            )
        """)
        cursor.execute("""
            INSERT INTO registro (nombre, apellido, correo, contraseña)
            VALUES (%s, %s, %s, %s)
        """, datos)
        conn.commit()
        cursor.close()
        conn.close()
        print("Datos insertados correctamente")
    except Exception as e:
        print("Error al insertar los datos: ", e)
        return e


import psycopg2

def db_operation(query,values):
    db_params={
        'dbname':'pathmentor' ,
        'user': 'postgres',
        'password': 'postgres',
        'host': 'localhost',
        'port': '5432'
    }
    
    try:
        conn = psycopg2.connect(**db_params)
        cursor = conn.cursor()
        cursor.execute(query,values)
        conn.commit()
        
    except Exception as error:
        print(error)
     
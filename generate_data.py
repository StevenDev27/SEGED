import random

months = ['ENERO','FEBRERO','MARZO','ABRIL','MAYO','JUNIO','JULIO','AGOSTO','SEPTIEMBRE','OCTUBRE','NOVIEMBRE','DICIEMBRE']
categories = ['ELECTRONICA', 'ALIMENTOS', 'HOGAR', 'DEPORTES', 'MODA']
bools = ['true', 'false']
classes = ['ALTA', 'MEDIA', 'BAJA']

def get_class(qty, noise=True):
    if noise and random.random() < 0.20: # 20% noise
        return random.choice(classes)
    if qty >= 75:
        return 'ALTA'
    elif qty >= 30:
        return 'MEDIA'
    else:
        return 'BAJA'

with open('demanda_productos.arff', 'w') as f:
    f.write('@RELATION demanda_productos\n\n')
    f.write('@ATTRIBUTE cantidadVendidaMes NUMERIC\n')
    f.write('@ATTRIBUTE stockActual NUMERIC\n')
    f.write('@ATTRIBUTE precioUnitario NUMERIC\n')
    f.write('@ATTRIBUTE categoria STRING\n')
    f.write('@ATTRIBUTE mesVenta {ENERO,FEBRERO,MARZO,ABRIL,MAYO,JUNIO,JULIO,AGOSTO,SEPTIEMBRE,OCTUBRE,NOVIEMBRE,DICIEMBRE}\n')
    f.write('@ATTRIBUTE frecuenciaReposicion NUMERIC\n')
    f.write('@ATTRIBUTE tienePromocion {false,true}\n')
    f.write('@ATTRIBUTE demanda {ALTA,MEDIA,BAJA}\n\n')
    f.write('@DATA\n')
    
    for _ in range(2500):
        qty = random.randint(0, 150)
        stock = random.randint(0, 100)
        price = round(random.uniform(1.0, 150.0), 2)
        cat = random.choice(categories)
        month = random.choice(months)
        freq = random.randint(0, 10)
        promo = random.choice(bools)
        cls = get_class(qty)
        f.write(f"{qty},{stock},{price},'{cat}',{month},{freq},{promo},{cls}\n")

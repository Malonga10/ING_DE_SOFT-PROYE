import tkinter as tk
from tkinter import messagebox
import requests

API_URL = "http://localhost:3000/api/orders/buy"

def comprar_producto():
    # 1. Obtener datos de los campos
    product_id = entry_id.get()
    cantidad = entry_qty.get()
    email = entry_email.get()
    api_key_usuario = entry_key.get() # <--- Nuevo: Leemos la clave de la caja

    # Validación básica
    if not product_id or not cantidad or not email or not api_key_usuario:
        messagebox.showwarning("Error", "Por favor llena todos los campos, incluyendo la Clave.")
        return

    payload = {
        "productId": product_id,
        "quantity": int(cantidad),
        "customerEmail": email
    }

    # Usamos la clave que escribió el usuario en la ventana
    headers = {
        "x-api-key": api_key_usuario,
        "Content-Type": "application/json"
    }

    try:
        response = requests.post(API_URL, json=payload, headers=headers)
        
        if response.status_code == 201:
            data = response.json()
            mensaje = f"✅ ¡Compra Exitosa!\n\nOrden ID: {data['orderId']}\nProducto: {data['product']}\nNuevo Stock: {data['newStock']}"
            messagebox.showinfo("Éxito", mensaje)
        elif response.status_code == 403:
            # Si el servidor dice "Prohibido" (Clave mal)
            messagebox.showerror("Alerta de Seguridad", "⛔ ACCESO DENEGADO\nLa clave API es incorrecta.")
        else:
            error_msg = response.json().get('error', 'Error desconocido')
            messagebox.showerror("Error del Servidor", f"❌ {error_msg}")

    except Exception as e:
        messagebox.showerror("Error de Conexión", f"No se pudo conectar al servidor:\n{e}")

# --- INTERFAZ GRÁFICA ---
root = tk.Tk()
root.title("Sistema de Ventas Híbrido")
root.geometry("400x500") # La hice un poco más alta
root.config(bg="#f0f0f0")

tk.Label(root, text="Punto de Venta Seguro", font=("Arial", 16, "bold"), bg="#f0f0f0").pack(pady=15)

# Campo API KEY (NUEVO)
tk.Label(root, text="🔑 API KEY (Seguridad):", bg="#f0f0f0", font=("Arial", 10, "bold"), fg="red").pack()
entry_key = tk.Entry(root, width=40) 
# entry_key.config(show="*") # Descomenta si quieres que salgan asteriscos
entry_key.pack(pady=5)

tk.Label(root, text="---------------------------------", bg="#f0f0f0").pack(pady=2)

# Campo ID
tk.Label(root, text="ID del Producto (MongoDB):", bg="#f0f0f0", font=("Arial", 10)).pack()
entry_id = tk.Entry(root, width=40)
entry_id.pack(pady=5)

# Campo Cantidad
tk.Label(root, text="Cantidad:", bg="#f0f0f0", font=("Arial", 10)).pack()
entry_qty = tk.Entry(root, width=40)
entry_qty.insert(0, "1")
entry_qty.pack(pady=5)

# Campo Email
tk.Label(root, text="Email del Cliente:", bg="#f0f0f0", font=("Arial", 10)).pack()
entry_email = tk.Entry(root, width=40)
entry_email.insert(0, "cliente@demo.com")
entry_email.pack(pady=5)

tk.Label(root, text="", bg="#f0f0f0").pack(pady=5)

btn_buy = tk.Button(root, text="REALIZAR COMPRA", command=comprar_producto, 
                    bg="#4CAF50", fg="white", font=("Arial", 12, "bold"), height=2, cursor="hand2")
btn_buy.pack(pady=10, fill="x", padx=40)

root.mainloop()
const express = require('express');
const bcrypt = require('bcrypt');
const axios = require('axios');
const jwt = require('jsonwebtoken');
const { sql, getPool } = require('./db');

const app = express();
app.use(express.static('pantallas'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//REGISTRO ESTUDIANTE
app.post('/registro', async (req, res) => {
  const { correo, contraseña, captcha } = req.body;

  if (!correo || !contraseña || !captcha) {
    return res.status(400).json({
      success: false,
      message: 'Por favor, completa todos los campos y resuelve el captcha.',
    });
  }

  if (!correo.endsWith('@uanl.edu.mx')) {
    return res.status(400).json({
      success: false,
      message: 'El correo debe ser institucional (@uanl.edu.mx).',
    });
  }

  try {

    const secretKey = '6LfqAzQrAAAAALCM2OEuglsde6Ol5FjZFclk2TBf';
    const verifyURL = `https://www.google.com/recaptcha/api/siteverify?secret=${secretKey}&response=${captcha}`;

    const captchaRes = await axios.post(verifyURL);
    if (!captchaRes.data.success) {
      return res.status(400).json({
        success: false,
        message: 'Captcha inválido. Intenta nuevamente.',
      });
    }

    const pool = await getPool();

    const result = await pool.request()
      .input('correo', sql.VarChar, correo)
      .query('SELECT * FROM Usuarios WHERE correo = @correo');

    if (result.recordset.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'Ya existe una cuenta registrada con este correo.',
      });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(contraseña, salt);

    await pool.request()
      .input('nombre_usuario', sql.VarChar, correo.split('@')[0])
      .input('contraseña', sql.VarChar, hashedPassword)
      .input('correo', sql.VarChar, correo)
      .input('id_rol', sql.Int, 2)
      .query('INSERT INTO Usuarios (nombre_usuario, contraseña, correo, id_rol) VALUES (@nombre_usuario, @contraseña, @correo, @id_rol)');

    res.status(200).json({ success: true, message: 'Estudiante registrado correctamente' });

  } catch (error) {
    console.error('Error en /registro:', error);
    res.status(500).json({ success: false, message: 'Error interno del servidor al registrar' });
  }
});


// INICIO SESIÓN ESTUDIANTE
app.post('/login', async (req, res) => {
  const { correo, contraseña } = req.body;

  if (!correo || !contraseña) {
    return res.status(400).json({
      success: false,
      message: 'Todos los campos son obligatorios.',
    });
  }

  try {
    const pool = await getPool();
    const result = await pool.request()
      .input('correo', sql.VarChar, correo)
      .query('SELECT * FROM Usuarios WHERE correo = @correo AND id_rol = 2');

    const user = result.recordset[0];

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Correo o contraseña incorrectos.',
      });
    }

    const isMatch = await bcrypt.compare(contraseña, user.contraseña);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Correo o contraseña incorrectos.',
      });
    }

    const token = jwt.sign(
      { id: user.id_usuario, correo: user.correo, rol: user.id_rol },
      'tu_secreto_muy_seguro',
      { expiresIn: '1h' }
    );

    res.status(200).json({
      success: true,
      message: 'Inicio de sesión exitoso como estudiante.',
      token,
    });

  } catch (error) {
    console.error('Error en /login:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor.',
    });
  }
});

//REGISTRO ADMIN
app.post('/registro-admin', async (req, res) => {
  const { correo, contraseña, clave, captcha } = req.body;

  if (!correo || !contraseña || !clave || !captcha) {
    return res.status(400).json({
      success: false,
      message: 'Por favor, completa todos los campos y resuelve el captcha.',
    });
  }

  if (clave !== "12345") {
    return res.status(401).json({
      success: false,
      message: 'Clave de administrador incorrecta.',
    });
  }

  try {
    const secretKey = '6LfqAzQrAAAAALCM2OEuglsde6Ol5FjZFclk2TBf';
    const verifyURL = `https://www.google.com/recaptcha/api/siteverify?secret=${secretKey}&response=${captcha}`;

    const captchaRes = await axios.post(verifyURL);
    if (!captchaRes.data.success) {
      return res.status(400).json({
        success: false,
        message: 'Captcha inválido. Intenta nuevamente.',
      });
    }

    const pool = await getPool();

    const result = await pool.request()
      .input('correo', sql.VarChar, correo)
      .query('SELECT * FROM Usuarios WHERE correo = @correo');

    if (result.recordset.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'Ya existe una cuenta registrada con este correo.',
      });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(contraseña, salt);

    await pool.request()
      .input('nombre_usuario', sql.VarChar, correo.split('@')[0])
      .input('contraseña', sql.VarChar, hashedPassword)
      .input('correo', sql.VarChar, correo)
      .input('id_rol', sql.Int, 1)
      .query('INSERT INTO Usuarios (nombre_usuario, contraseña, correo, id_rol) VALUES (@nombre_usuario, @contraseña, @correo, @id_rol)');

    res.status(200).json({ success: true, message: 'Administrador registrado correctamente' });

  } catch (error) {
    console.error('Error en /registro-admin:', error);
    res.status(500).json({ success: false, message: 'Error interno del servidor al registrar administrador' });
  }
});


//INICIO SESION ADMIN
app.post('/loginAdmin', async (req, res) => {
  const { correo, contraseña, clave } = req.body;

  if (!correo || !contraseña || !clave) {
    return res.status(400).json({
      success: false,
      message: 'Todos los campos son obligatorios.',
    });
  }

  if (clave !== '12345') {
    return res.status(401).json({
      success: false,
      message: 'Clave de administrador incorrecta.',
    });
  }

  try {
    const pool = await getPool();
    const result = await pool.request()
      .input('correo', sql.VarChar, correo)
      .query('SELECT * FROM Usuarios WHERE correo = @correo AND id_rol = 1');

    const user = result.recordset[0];

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Correo o contraseña incorrectos.',
      });
    }

    const isMatch = await bcrypt.compare(contraseña, user.contraseña);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Correo o contraseña incorrectos.',
      });
    }

    const token = jwt.sign(
      { id: user.id_usuario, correo: user.correo, rol: user.id_rol },
      'tu_secreto_muy_seguro',
      { expiresIn: '1h' }
    );

    res.status(200).json({
      success: true,
      message: 'Inicio de sesión exitoso como administrador.',
      token,
    });

  } catch (error) {
    console.error('Error en /loginAdmin:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor.',
    });
  }
});




app.listen(3000, () => console.log('Servidor corriendo en http://localhost:3000'));

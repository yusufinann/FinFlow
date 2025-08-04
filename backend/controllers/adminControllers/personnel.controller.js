import pool from "../../config/db.js"

//username 6 haneli sayı olcak!!
const generateUniquePersonnelUsername = async () => {
    let username;
    let isUnique=false;
    while(!isUnique){
        username=Math.floor(100000 + Math.random() * 900000).toString();
        const [rows] = await pool.query(
            "SELECT customer_id FROM customers WHERE username = ?",
            [username]
        );
        if (rows.length === 0) {
            isUnique = true;
        }
    }
    return username;
}

export const createPersonnel= async (req, res) => {
   const {tckn,first_name, last_name, branch_code,birth_date,gender,phone_number,email,address } = req.body;
  
 if (!tckn || !first_name || !last_name) {
    return res.status(400).json({
      success: false,
      message: "Ad, Soyad zorunludur.",
    });
  }
  try {
    const username= await generateUniquePersonnelUsername();
    const sql=`INSERT INTO customers (tckn,username,first_name, last_name,birth_date,gender,phone_number,email,address,branch_code, role)
              VALUES (?,?,?,?,?,?,?,?,?,?,'PERSONNEL')`;

              const values = [tckn,username,first_name, last_name,birth_date || null,
      gender || null, phone_number, email || null, address || null,branch_code || null];
     const [result] = await pool.query(sql, values);

     res.status(201).json({
      success: true,
      message: "Personel başarıyla oluşturuldu.",
      data: {
        personnelId: result.insertId,
        username: username,
      }   });

    
  } catch (error) {
    console.error("Müşteri oluşturma sırasında hata:", error);
    if (error.code === "ER_DUP_ENTRY") {
      return res.status(409).json({
        success: false,
        message: "Bu TCKN, E-posta veya Telefon Numarası zaten kayıtlı.",
      });
    }
    res.status(500).json({
      success: false,
      message: "Sunucu hatası oluştu.",
    });
  }
};

export const getAllPersonnels = async (req, res) => {
  const sql="SELECT customer_id,username,tckn,first_name,last_name,birth_date,gender,phone_number,email,address,branch_code FROM customers WHERE role = 'PERSONNEL' ORDER BY created_at DESC"
 try {
  const [rows]=await pool.query(sql);
  res.status(200).json({
    success: true,
    data: rows,
  });
 } catch (error) {
  console.error("Personel bilgilerini alırken hata:", error);
  res.status(500).json({
    success: false,
    message: "Sunucu hatası oluştu.",
  });
 }
}
export const getPersonelByTckn=async (req, res) => { 
     const {tckn} = req.params;

     if(!tckn){
      return res.status(400).json({
        success: false,
        message: "TCKN zorunludur.",
      })
     }

     const personnelSql="SELECT * FROM customers WHERE (tckn = ?) AND role = 'PERSONNEL'";

     try {
        const[personnelRows]=await pool.query(personnelSql, [tckn]);

        if (personnelRows.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Bu TCKN ile kayıtlı bir personel bulunamadı.",
            });
        }
        res.status(200).json({
            success: true,
            data: personnelRows[0],
        });
     } catch (error) {
        console.error("Personel bilgilerini alırken hata:", error);
        res.status(500).json({
            success: false,
            message: "Sunucu hatası oluştu.",
        });
     }
}
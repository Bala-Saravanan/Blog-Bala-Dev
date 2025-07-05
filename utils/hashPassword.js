import bcrypt from "bcryptjs";

async function hashPassword(password) {
  await bcrypt.hash(password, 10).then((data) => console.log(data));
}

hashPassword("jbala174");

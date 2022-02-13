package com.totocastaldi.moneycontrol

import android.content.Intent
import androidx.appcompat.app.AppCompatActivity
import android.os.Bundle
import android.text.TextUtils
import android.widget.Button
import android.widget.TextView
import android.widget.Toast
import com.google.firebase.auth.FirebaseAuth

class LoginActivity : AppCompatActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_login)

        val buttonLogin : Button = findViewById(R.id.buttonLogin)
        val userEmail : TextView = findViewById(R.id.emailLogin)
        val userPassword : TextView = findViewById(R.id.passwordLogin)

        buttonLogin.setOnClickListener {
            val email : String = userEmail.text.toString().trim { it <= ' ' }
            val password : String = userPassword.text.toString().trim { it <= ' ' }
            when {
                TextUtils.isEmpty(email) -> {
                    Toast.makeText(
                        this@LoginActivity,
                        "Inserisci email",
                        Toast.LENGTH_SHORT
                    ).show()
                }


                TextUtils.isEmpty(password) -> {
                    Toast.makeText(
                        this@LoginActivity,
                        "Inserisci password",
                        Toast.LENGTH_SHORT
                    ).show()
                }

                else -> {
                    //Firebase.auth
                    FirebaseAuth.getInstance().signInWithEmailAndPassword(email, password).addOnCompleteListener {
                        task ->
                        if (task.isSuccessful) {
                            Toast.makeText(
                                this@LoginActivity,
                                "Autenticato",
                                Toast.LENGTH_SHORT
                            ).show()

                            FirebaseAuth.getInstance().currentUser!!.getIdToken(true).addOnCompleteListener {
                                idTokenTask ->
                                if (idTokenTask.isSuccessful) {
                                    val intent = Intent(this@LoginActivity, ExtraBudgetActivity::class.java)
                                    intent.flags = Intent.FLAG_ACTIVITY_NEW_TASK or Intent.FLAG_ACTIVITY_CLEAR_TASK
                                    intent.putExtra("idToken", idTokenTask.result?.token.toString())
                                    startActivity(intent)
                                    finish()
                                }
                            }


                        } else {
                            Toast.makeText(
                                this@LoginActivity,
                                task.exception!!.message.toString(),
                                Toast.LENGTH_SHORT
                            ).show()
                        }
                    }

                }
            }
        }
    }
}
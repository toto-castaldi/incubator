package com.totocastaldi.moneycontrol

import androidx.appcompat.app.AppCompatActivity
import android.os.Bundle
import android.util.Log
import android.widget.TextView
import androidx.lifecycle.Observer
import androidx.lifecycle.ViewModelProvider
import com.totocastaldi.moneycontrol.repository.Repository

class ExtraBudgetActivity : AppCompatActivity() {

    private lateinit var viewModel: ExtraBudgetViewModel

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_extra_budget)

        val budgetView : TextView = findViewById(R.id.userId)
        val spentView : TextView = findViewById(R.id.userEmail)

        Log.d("API", intent.getStringExtra("idToken").toString())

        val repository = Repository()
        val viewModelFactory = ExtraBudgetViewModelFactory(repository)
        viewModel = ViewModelProvider(this, viewModelFactory).get(ExtraBudgetViewModel::class.java)
        viewModel.getExtraBudget(intent.getStringExtra("idToken").toString())
        viewModel.myReposnse.observe(this, Observer { response ->
            if (response.isSuccessful) {
                budgetView.text = response.body()?.extraBuget.toString()
                spentView.text = response.body()?.extraSpent.toString()
            } else {
                Log.d("API", response.errorBody()?.string()!!)
            }

        })
    }
}
package com.totocastaldi.moneycontrol

import androidx.lifecycle.ViewModel
import androidx.lifecycle.ViewModelProvider
import com.totocastaldi.moneycontrol.repository.Repository

class ExtraBudgetViewModelFactory(private val repository: Repository): ViewModelProvider.Factory {
    override fun <T : ViewModel?> create(modelClass: Class<T>): T {
         return ExtraBudgetViewModel(repository) as T
    }
}
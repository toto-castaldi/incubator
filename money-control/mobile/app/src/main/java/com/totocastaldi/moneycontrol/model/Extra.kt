package com.totocastaldi.moneycontrol.model

import com.google.gson.annotations.SerializedName

data class Extra (

    @SerializedName("extra_budget")
    val extraBuget : String,
    @SerializedName("extra_spent")
    val extraSpent : String
)
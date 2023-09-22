!function() {
  //Experience and gold modification
  BattleManager.makeRewards = function() {

      //Config choices
      let presets_choice = Snek.ModConfigs.checkConfig('Presets').index;
      let custom_restriction = Snek.ModConfigs.checkConfig('Multipliers restriction').index;

      //Reward factors declarations
      let exp_factor = 1;
      let gold_factor = 1;
      
      //Checks if the player is in HEADSPACE or FARAWAY
      if (($gameSwitches.value(7) && custom_restriction == 1) || (!$gameSwitches.value(7) && custom_restriction == 0) || custom_restriction == 2) {
        switch(presets_choice){
            case 0: //If the user chose "EASY"
                exp_factor = 1.25;
                gold_factor = 1.25;
                break;
            case 1: //If the user chose "NORMAL"
                exp_factor = 1;
                gold_factor = 1;
                break;
            case 2://If the user chose "HARD"
                exp_factor = 1;
                gold_factor = 1;
                break;
            case 3://If the user chose "INSANE"
                exp_factor = 0.75;
                gold_factor = 0.75;
                break;
            case 4://If the user chose "MERCILESS"
                exp_factor = 0.75;
                gold_factor = 0.75;
                break;
        }
      }
            
      //Apply factors
      this._rewards = {};
      this._rewards.gold = parseInt(gold_factor * $gameTroop.goldTotal());
      this._rewards.exp = parseInt(exp_factor * $gameTroop.expTotal());
      this._rewards.items = $gameTroop.makeDropItems();
  };
}()
!function(){
  let old_Game_Battler_prototype_performResultEffects = Game_Battler.prototype.performResultEffects
  Game_Battler.prototype.performResultEffects = function() {
    old_Game_Battler_prototype_performResultEffects.call(this)
      if (this.result().critical && Math.random() < 0.5 && !this.isEnemy()) {
        if (Snek.ModConfigs.checkConfig('Scary critical hits').index == 0){
          this.addState(18);
        }
      }
  };

  Game_Actor.prototype.statusFaceIndex = function () {
    if(!!$gameTemp._secondChance && this.actorId() === 1) {return 15;}
    if(!!$gameTemp._damagedPlayer) {return 2;}
    // If Use victory face and is alive
    if (this._useVictoryFace && this.isAlive()) {
      // Return victory face
      return 10;
    };
    // Check for second Chance;
    // Get Main State
    var state = this.states()[0];
    // If State
    if (state) {
      // If Alt switch index exist
      if (state.meta.AltIndexSwitch) {
        // If alt switch is on
        if ($gameSwitches.value(Number(state.meta.AltIndexSwitch))) {
          // Return alternate face index
          return Number(state.meta.AltStateFaceIndex)
        };
      }
      // If face index exists return it
      //if(state.id === this.deathStateId() && this.actorId() === 1) {return 9;}
      if (state.meta.StateFaceIndex) { return Number(state.meta.StateFaceIndex); };
    };
    // Get Fear Index
    const fearIndex = this.actor().meta.FearBattleFaceIndex;
    // If Fear index is valid and switch 92 is on
    if (fearIndex && $gameSwitches.value(92)) {
      return Number(fearIndex)
    }
    // Return default
    return 0;
  };

  let old_n_scared_members = 0;
  let old_Scene_Battle_prototype_startPartyCommandSelection = Scene_Battle.prototype.startPartyCommandSelection;
  Scene_Battle.prototype.startPartyCommandSelection = function() {
    // Run Original Function
    // Counts how many party members are AFRAID
    let n_scared_members = $gameParty.members().filter(member => member.isStateAffected(18)).length

    // Counts the difference with previous turn
    let afraid_difference = old_n_scared_members - n_scared_members;

    if (Snek.ModConfigs.checkConfig('Scary critical hits').index == 0){
      // If more AFRAID allies than before, increase escape rate accordingly
      if (afraid_difference < 0) {
        for (let i = 0; i < -afraid_difference; i++) {
          BattleManager._escapeRatio += 0.1;
        }

      // If less AFRAID allies than before, decrease escape rate accordingly
      } else if (afraid_difference > 0) {
        for (let i = 0; i < afraid_difference; i++) {
          BattleManager._escapeRatio -= 0.1;
        }
      }
    }

    old_n_scared_members = n_scared_members;

    // Does the rest
    old_Scene_Battle_prototype_startPartyCommandSelection.call(this);
  };
}()

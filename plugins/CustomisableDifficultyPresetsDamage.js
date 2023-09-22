!function() {
  //Damage dealt and taken modification
  let old_Game_Action_prototype_executeDamage = Game_Action.prototype.executeDamage
  Game_Action.prototype.executeDamage = function(target, value) {

    //Config choices
    let presets_choice = Snek.ModConfigs.checkConfig('Presets').index;
    let custom_restriction = Snek.ModConfigs.checkConfig('Multipliers restriction').index;

    //Damage factors and new_value declarations
    let dealt_factor = 1;
    let taken_factor = 1;
    let stronghit_factor = 1;
    let weakhit_factor = 1;
    let new_value = value;

    if (($gameSwitches.value(7) && custom_restriction == 1) || (!$gameSwitches.value(7) && custom_restriction == 0) || custom_restriction == 2) {
        switch(presets_choice){
            case 0: //If the user chose "EASY"
                dealt_factor = 1.5;
                taken_factor = 0.5;
                stronghit_factor = 1;
                weakhit_factor = 1;
                break;
            case 1: //If the user chose "NORMAL"
                dealt_factor = 1;
                taken_factor = 1;
                stronghit_factor = 1;
                weakhit_factor = 1;
                break;
            case 2://If the user chose "HARD"
                dealt_factor = 0.75;
                taken_factor = 1.25;
                stronghit_factor = 1;
                weakhit_factor = 1;
                break;
            case 3://If the user chose "INSANE"
                dealt_factor = 0.5;
                taken_factor = 1.5;
                stronghit_factor = 1;
                weakhit_factor = 1;
                break;
            case 4://If the user chose "MERCILESS"
                dealt_factor = 0.5;
                taken_factor = 2;
                stronghit_factor = 1.5;
                weakhit_factor = 0.5;
                break;
        }
    }
    
    //If it's not a "heal", apply the factor
    if (value > 0) {
        if (target.isEnemy()){
            //If the attack hits an enemy, apply "dealt_factor"
            new_value = parseInt(value * dealt_factor);
        } else {
            //If the attack hits a friend, apply "taken_factor"
            new_value = parseInt(value * taken_factor);
        }
    }

    // Set elemental results
    let elementRate = this.calcElementRate(target);
    MovingAttack = elementRate > 1;
    DullAttack = elementRate < 1;
    var result = target.result();

    if (MovingAttack || result.critical) {
    new_value = parseInt(new_value * stronghit_factor);
    } else if (DullAttack) {
    new_value = parseInt(new_value * weakhit_factor);
    }

    //Does the rest
    old_Game_Action_prototype_executeDamage.call(this, target, new_value)
  };

  Game_Action.prototype.applyGuard = function(damage, target) {
    let presets_choice = Snek.ModConfigs.checkConfig('Presets').index;
    let custom_restriction = Snek.ModConfigs.checkConfig('Multipliers restriction').index;

    let weakhit_factor = 1;

    if (($gameSwitches.value(7) && custom_restriction == 1) || (!$gameSwitches.value(7) && custom_restriction == 0) || custom_restriction == 2) {
        if (presets_choice == 4) {
            weakhit_factor = 0.5;
        }
    }
    
    return (damage > 0 && target.isGuard() ? weakhit_factor * damage / 2 * target.grd : damage);
  };
}()
!function() {
  // Make it scrollable
    Window_BattleSkill.prototype.maxPageRows = function() { return 2;}

    // Unfuck the arrow
    let old_refresh_arrows = Window_BattleSkill.prototype._refreshArrows;
    Window_BattleSkill.prototype._refreshArrows = function() {
        old_refresh_arrows.call(this);
        this._downArrowSprite.y = 58;
    }

    let old_skill_equip_initialize = Window_OmoMenuActorSkillEquip.prototype.initialize;
    Window_OmoMenuActorSkillEquip.prototype.initialize = function() {
        let custom_n_skills = 4;
        let chosen_n_skills = Snek.ModConfigs.checkConfig('Number of skills').index;
        switch(chosen_n_skills) {
            case 0:
                custom_n_skills = 4;
                break;
            case 1:
                custom_n_skills = 6;
                break;
            case 2:
                custom_n_skills = 8;
                break;
            case 3:
                custom_n_skills = 10;
                break;
            case 4:
                custom_n_skills = 12;
                break;
            case 5:
                custom_n_skills = 14;
                break;
        }
        this.allowedMax = custom_n_skills;
        old_skill_equip_initialize.call(this);
    }

    Window_OmoMenuActorSkillEquip.prototype.maxItems = function() {  return this.allowedMax; }
    Window_OmoMenuActorSkillEquip.prototype.maxPageRows = function() {  return 4; }

    let old_set_actor_index = Window_OmoMenuActorSkillEquip.prototype.setActorIndex;
    Window_OmoMenuActorSkillEquip.prototype.setActorIndex = function(index) {
        let custom_n_skills = 4;
        let chosen_n_skills = Snek.ModConfigs.checkConfig('Number of skills').index;
        switch(chosen_n_skills) {
            case 0:
                custom_n_skills = 4;
                break;
            case 1:
                custom_n_skills = 6;
                break;
            case 2:
                custom_n_skills = 8;
                break;
            case 3:
                custom_n_skills = 10;
                break;
            case 4:
                custom_n_skills = 12;
                break;
            case 5:
                custom_n_skills = 14;
                break;
        }
        this.allowedMax = custom_n_skills;
        old_set_actor_index.call(this, ...arguments);
    }

    // Inject controlls
    let oldEquip = Game_Actor.prototype.equipSkill;
    Game_Actor.prototype.equipSkill = function() {
        let custom_n_skills = 4;
        let chosen_n_skills = Snek.ModConfigs.checkConfig('Number of skills').index;
        switch(chosen_n_skills) {
            case 0:
                custom_n_skills = 4;
                break;
            case 1:
                custom_n_skills = 6;
                break;
            case 2:
                custom_n_skills = 8;
                break;
            case 3:
                custom_n_skills = 10;
                break;
            case 4:
                custom_n_skills = 12;
                break;
            case 5:
                custom_n_skills = 14;
                break;
        }

        for (let i = 0; i < custom_n_skills; i++) {
          if (!this._equippedSkills[i]) {
            this._equippedSkills[i] = 0;
          }
        }

        oldEquip.call(this, ...arguments);
    }
}()
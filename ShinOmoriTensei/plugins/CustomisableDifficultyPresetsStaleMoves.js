!function() {

  // Defines the dictionary of previously used skills and the variable that checks if the attack has hit at least once
  var usedSkills = {};
  var hasLastSkillHit = false;

  // Empties the dictionary of previously used skills
  let old_BattleManager_setup = BattleManager.setup;
  BattleManager.setup = function(troopId, canEscape, canLose) {
    if (!canEscape) {
      usedSkills = {};
    }
    old_BattleManager_setup.call(this, troopId, canEscape, canLose);
  };

  // Initializes hasLastSkillHit
  let old_BattleManager_startAction = BattleManager.startAction;
  BattleManager.startAction = function() {
    hasLastSkillHit = false;
    old_BattleManager_startAction.call(this);
  };

  // Nerfs the attack based on the number of past usage and adds it to the list except if it completely missed 
  let old_Game_Action_prototype_executeDamage = Game_Action.prototype.executeDamage;
  Game_Action.prototype.executeDamage = function(target, value) {
    let skillId = this._item._itemId;

    // If not an enemy
    if (this.subject().isActor()) {
      let actorId = this.subject().actorId();

      // Intializes the section of the dictionary corresponding to that character if it doesn't exist yet
      if (!(actorId in usedSkills)) {
        usedSkills[actorId] = [];
      }

      // Counts the number of occurences of that skill in the character's queue
      let previousUsage = usedSkills[actorId].filter(x => x == skillId).length;
      if (Snek.ModConfigs.checkConfig('Stale moves').index == 0){
        value = parseInt(value*(1-previousUsage/10));
      }

      // If the skill has not already hit, it is added to the character's queue
      if (!hasLastSkillHit) {
        usedSkills[actorId].push(skillId);
        if (usedSkills[actorId].length > 10) {
          usedSkills[actorId].shift();
        }
        hasLastSkillHit = true;
      }

      
    }

    old_Game_Action_prototype_executeDamage.call(this, target, value);
  };

  // Loading a savefile refreshes the queue (but that's a SECRET!!!!)
  Scene_OmoriFile.prototype.terminate = function() {
    Scene_Base.prototype.terminate.call(this);
    if (this._loadSuccess) {
      usedSkills = {};
      $gameSystem.onAfterLoad();
    };
  };
}()
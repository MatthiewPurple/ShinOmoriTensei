!function() {
  BattleManager.getActorInputOrder = function() {
    let members = $gameParty.members();
  
    // separate members into an array of arrays each containing only their index agility, and dead status
    let list = members.map((el, index) => [index, el.agi, el.isAlive() && el.isBattleMember()])
    // sort by agility (sort is performed in place so no need to reassign list)
    list.sort((a, b) => b[1] > a[1])
    // remove dead members
    list = list.filter(_ => _[2])
    // reduce array to just the indexes
    return list.map(_ => _[0])
  };
}()
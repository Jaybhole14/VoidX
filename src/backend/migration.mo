import Map "mo:core/Map";
import List "mo:core/List";
import Principal "mo:core/Principal";

module {
  type GuardianContact = {
    name : Text;
    phoneNumber : Text;
  };

  type PanicLog = {
    timestamp : Int;
  };

  type OldUserData = {
    guardianContacts : [var ?GuardianContact];
    panicLog : List.List<PanicLog>;
  };

  type OldActor = {
    users : Map.Map<Principal, OldUserData>;
  };

  type NewUserData = {
    guardianContacts : [var ?GuardianContact];
    panicLog : List.List<PanicLog>;
    blockedNumbers : List.List<Text>;
    languagePreference : ?Text;
  };

  type NewActor = {
    users : Map.Map<Principal, NewUserData>;
  };

  public func run(old : OldActor) : NewActor {
    let newUsers = old.users.map<Principal, OldUserData, NewUserData>(
      func(_p, oldUserData) {
        { oldUserData with blockedNumbers = List.empty<Text>(); languagePreference = null };
      }
    );
    { users = newUsers };
  };
};

import Map "mo:core/Map";
import List "mo:core/List";
import Time "mo:core/Time";
import Principal "mo:core/Principal";
import Runtime "mo:core/Runtime";

actor {
  type GuardianContact = {
    name : Text;
    phoneNumber : Text;
  };

  type PanicLog = {
    timestamp : Int;
  };

  type UserData = {
    var guardianContact : ?GuardianContact;
    panicLog : List.List<PanicLog>;
  };

  module UserData {
    public func create() : UserData {
      {
        var guardianContact = null : ?GuardianContact;
        panicLog = List.empty<PanicLog>();
      };
    };
  };

  let users = Map.empty<Principal, UserData>();

  func getUserData(caller : Principal) : UserData {
    switch (users.get(caller)) {
      case (?userData) { userData };
      case (null) {
        let newUserData = UserData.create();
        users.add(caller, newUserData);
        newUserData;
      };
    };
  };

  public shared ({ caller }) func saveGuardianContact(name : Text, phoneNumber : Text) : async () {
    let userData = getUserData(caller);
    userData.guardianContact := ?{ name; phoneNumber };
  };

  public query ({ caller }) func getGuardianContact() : async GuardianContact {
    let userData = getUserData(caller);
    switch (userData.guardianContact) {
      case (?contact) { contact };
      case (null) { Runtime.trap("No guardian contact saved.") };
    };
  };

  public shared ({ caller }) func logPanicActivation() : async () {
    let userData = getUserData(caller);
    let newLog = { timestamp = Time.now() };
    userData.panicLog.add(newLog);
  };

  public query ({ caller }) func getPanicLog() : async [PanicLog] {
    let userData = getUserData(caller);
    userData.panicLog.toArray();
  };
};

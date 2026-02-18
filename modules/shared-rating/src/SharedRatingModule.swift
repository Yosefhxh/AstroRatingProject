import ExpoModulesCore
import Foundation
import WidgetKit

let kAppGroup = "group.codeyosef.AstroRatingProject"
let kRatingKey = "currentRating"

public class SharedRatingModule: Module {
  private var observer: NSObjectProtocol?
  
  public func definition() -> ModuleDefinition {
    Name("SharedRating")
    
    Events("onRatingChanged")
    
    OnCreate {
      setupNotificationObserver()
    }
    
    OnDestroy {
      removeNotificationObserver()
    }
    
    Function("getRating") { () -> Int in
      let defaults = UserDefaults(suiteName: kAppGroup)
      return defaults?.integer(forKey: kRatingKey) ?? 0
    }
    
    Function("setRating") { (rating: Int) in
      let defaults = UserDefaults(suiteName: kAppGroup)
      let clampedRating = min(max(rating, 0), 5)
      defaults?.set(clampedRating, forKey: kRatingKey)
      defaults?.synchronize()
      
      // Reload widgets when rating changes from the app
      WidgetCenter.shared.reloadAllTimelines()
    }
  }
  
  private func setupNotificationObserver() {
    let defaults = UserDefaults(suiteName: kAppGroup)
    observer = NotificationCenter.default.addObserver(
      forName: UserDefaults.didChangeNotification,
      object: defaults,
      queue: .main
    ) { [weak self] _ in
      self?.handleRatingChange()
    }
  }
  
  private func removeNotificationObserver() {
    if let observer = observer {
      NotificationCenter.default.removeObserver(observer)
      self.observer = nil
    }
  }
  
  private func handleRatingChange() {
    let defaults = UserDefaults(suiteName: kAppGroup)
    let rating = defaults?.integer(forKey: kRatingKey) ?? 0
    sendEvent("onRatingChanged", ["rating": rating])
  }
}

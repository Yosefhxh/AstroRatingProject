import WidgetKit
import SwiftUI
import AppIntents

// App group used to share rating between the app and the widget.
let kAppGroup = "group.codeyosef.AstroRatingProject"

// Simple App Intent to set the rating from the widget.
struct SetRatingIntent: AppIntent {
    static var title: LocalizedStringResource = "Set Rating"

    @Parameter(title: "Rating")
    var rating: Int

    func perform() async throws -> some IntentResult {
        let defaults = UserDefaults(suiteName: kAppGroup)
        defaults?.set(rating, forKey: "currentRating")
        WidgetCenter.shared.reloadAllTimelines()
        return .result()
    }
}

// Timeline entry
struct RatingEntry: TimelineEntry {
    let date: Date
    let rating: Int
}

// Provider reads the shared UserDefaults for the current rating.
struct Provider: TimelineProvider {
    func placeholder(in context: Context) -> RatingEntry {
        RatingEntry(date: Date(), rating: 3)
    }

    func getSnapshot(in context: Context, completion: @escaping (RatingEntry) -> Void) {
        let entry = RatingEntry(date: Date(), rating: currentRating())
        completion(entry)
    }

    func getTimeline(in context: Context, completion: @escaping (Timeline<RatingEntry>) -> Void) {
        let entry = RatingEntry(date: Date(), rating: currentRating())
        // We don't need frequent updates; refresh is triggered by the AppIntent.
        let timeline = Timeline(entries: [entry], policy: .never)
        completion(timeline)
    }

    private func currentRating() -> Int {
        let defaults = UserDefaults(suiteName: kAppGroup)
        let r = defaults?.integer(forKey: "currentRating") ?? 0
        return min(max(r, 0), 5)
    }
}

// Widget view: shows 1..5 tappable stars. Uses App Intents as actions for interactivity.
struct RatingWidgetEntryView : View {
    var entry: Provider.Entry

    private func makeIntent(_ value: Int) -> SetRatingIntent {
        let intent = SetRatingIntent()
        intent.rating = value
        return intent
    }

    @ViewBuilder
    private func starView(_ i: Int) -> some View {
        let filled = i <= entry.rating

        Button(intent: makeIntent(i)) {
            Image(systemName: filled ? "star.fill" : "star")
                .resizable()
                .aspectRatio(contentMode: .fit)
                .frame(width: 22, height: 22)
                .foregroundColor(filled ? Color.yellow : Color(white: 0.7))
                .scaleEffect(filled ? 1.06 : 1)
                .animation(.spring(response: 0.28, dampingFraction: 0.6), value: entry.rating)
        }
        .buttonStyle(.plain)
    }

    var body: some View {
        HStack(spacing: 6) {
            starView(1)
            starView(2)
            starView(3)
            starView(4)
            starView(5)
        }
        .padding()
    }
}

struct RatingWidget: Widget {
    let kind: String = "RatingWidget"

    var body: some WidgetConfiguration {
        StaticConfiguration(kind: kind, provider: Provider()) { entry in
            RatingWidgetEntryView(entry: entry)
        }
        .configurationDisplayName("Rating Stars")
        .description("Califica de 1 a 5 estrellas desde el widget.")
        .supportedFamilies([.systemSmall, .systemMedium])
    }
}

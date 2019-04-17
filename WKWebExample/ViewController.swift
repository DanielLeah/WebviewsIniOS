//
//  ViewController.swift
//  WKWebExample
//
//  Created by David Daniel Leah (BFS EUROPE) on 15/04/2019.
//  Copyright © 2019 David Daniel Leah (BFS EUROPE). All rights reserved.
//

import UIKit
import WebKit


class ViewController: UIViewController, WKNavigationDelegate, WKScriptMessageHandler{

    @IBOutlet weak var webView: WKWebView!
    var inputsHTML = [String : AnyObject]()

    @IBOutlet weak var activityIndicator: UIActivityIndicatorView!
    override func viewDidLoad() {
        super.viewDidLoad()
        
        webView.navigationDelegate = self
        webView.configuration.userContentController.add(self, name: "jsHandler")
        let url = Bundle.main.url(forResource: "index", withExtension: "html", subdirectory: "Project Assesment")!
        webView.loadFileURL(url, allowingReadAccessTo: url)
        let request = URLRequest(url: url)
        webView.load(request)
        webView.addObserver(self, forKeyPath: #keyPath(WKWebView.isLoading), options: .new, context: nil)
        
    }
    
    
    func saveData(data: [String : AnyObject]) {
        UserDefaults.standard.set(data, forKey: "userDetails")
    }
    
    func updateHTMLUI(){
        if let inputsDetails = UserDefaults.standard.dictionary(forKey: "userDetails"){
            webView.evaluateJavaScript("document.getElementById(\"firstname\").value = \"\(inputsDetails["firstName"]!)\"", completionHandler: nil)
            webView.evaluateJavaScript("document.getElementById(\"lastname\").value = \"\(inputsDetails["lastName"]!)\"", completionHandler: nil)
            webView.evaluateJavaScript("document.getElementById(\"email\").value = \"\(inputsDetails["email"]!)\"", completionHandler: nil)
            webView.evaluateJavaScript("document.getElementById(\"gender\").value = \"\(inputsDetails["gender"]!)\"", completionHandler: nil)
            webView.evaluateJavaScript("document.getElementById(\"bday\").value = \"\(inputsDetails["bday"]!)\"", completionHandler: nil)
        }

    }
    
    
    //DELEGATES
    
    override func observeValue(forKeyPath keyPath: String?, of object: Any?, change: [NSKeyValueChangeKey : Any]?, context: UnsafeMutableRawPointer?) {
        if keyPath == "loading"{
            if webView.isLoading{
                activityIndicator.startAnimating()
                activityIndicator.isHidden = false
            }else{
                activityIndicator.stopAnimating()
                activityIndicator.isHidden = true
            }
        }
    }

    func userContentController(_ userContentController: WKUserContentController, didReceive message: WKScriptMessage) {
        if message.name == "jsHandler" {
            inputsHTML = message.body as! [String : AnyObject]
            saveData(data: inputsHTML)
            DispatchQueue.main.asyncAfter(deadline: .now() + .seconds(2)) {
                self.webView.evaluateJavaScript("controller.clearLocalInputs()", completionHandler: nil)
                DispatchQueue.main.asyncAfter(deadline: .now() + .seconds(2)) {
                    self.updateHTMLUI()
                }
            }
        }
    }

}


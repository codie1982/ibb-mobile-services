
Pod::Spec.new do |s|
  s.name         = "RNIbbMobileServices"
  s.version      = "1.0.0"
  s.summary      = "RNIbbMobileServices"
  s.description  = <<-DESC
                  RNIbbMobileServices
                   DESC
  s.homepage     = "https://github.com/codie1982/ibb-mobile-services.git"
  s.license      = "MIT"
  s.license     = { :type => "MIT", :file => "FILE_LICENSE" }
  s.author       = { "author" => "author@domain.cn" }
  s.platform     = :ios, "9.0"
  s.ios.deployment_target = '9.0'
  s.tvos.deployment_target = '10.0'

  s.source       = { :git => "https://github.com/codie1982/ibb-mobile-services", :tag => "master" }
  s.source_files  = "ios/**/*.{h,m}"
  s.requires_arc = true


  s.dependency "React"
  #s.dependency "others"

end

  